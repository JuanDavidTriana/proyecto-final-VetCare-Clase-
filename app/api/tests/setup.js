process.env.NODE_ENV = 'test';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vetcare-test';
process.env.BETTER_AUTH_SECRET = 'test-secret-with-more-than-thirty-two-characters';
