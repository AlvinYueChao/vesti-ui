// Jest 配置文件 - 用于配置测试框架
module.exports = {
  // 使用 ts-jest 预设，支持 TypeScript
  preset: 'ts-jest',
  
  // 测试环境设置为 Node.js
  testEnvironment: 'node',
  
  // 测试文件查找根目录
  roots: ['<rootDir>/__tests__'],
  
  // 测试文件匹配规则
  testMatch: ['**/__tests__/**/*.test.ts'],
  
  // TypeScript 文件转换配置
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  
  // 覆盖率收集配置
  collectCoverageFrom: [
    'services/**/*.ts',
    '!services/**/*.d.ts',
  ],
  
  // 覆盖率报告输出目录
  coverageDirectory: 'coverage',
  
  // 覆盖率报告格式
  coverageReporters: ['text', 'lcov', 'html'],
  
  // 测试设置文件（可选）
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};