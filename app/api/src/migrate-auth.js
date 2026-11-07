import mongoose from 'mongoose';
import { provisionAuthAccount } from './config/auth.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { User } from './modules/users/user.model.js';

async function migrateAuthAccounts() {
  const authUsers = mongoose.connection.db.collection('user');
  const accounts = mongoose.connection.db.collection('account');
  await authUsers.createIndex({ email: 1 }, { unique: true });

  const users = await User.find().select('+password').lean();
  let migrated = 0;
  let withoutPassword = 0;

  for (const user of users) {
    const existingEmail = await authUsers.findOne({ email: user.email });
    if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
      throw new Error(`El correo ${user.email} ya está asociado a otro usuario de Better Auth`);
    }

    if (!user.password) {
      withoutPassword += 1;
      continue;
    }

    const existingAccount = await accounts.findOne({
      providerId: 'credential',
      userId: user._id,
    });
    await provisionAuthAccount(user);
    if (!existingAccount) migrated += 1;
  }

  console.log(`Migración completada: ${migrated} cuentas importadas; ${withoutPassword} usuarios sin contraseña importable.`);
}

try {
  await connectDB(env.mongoUri);
  await migrateAuthAccounts();
} catch (error) {
  console.error('Error migrando cuentas a Better Auth:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
