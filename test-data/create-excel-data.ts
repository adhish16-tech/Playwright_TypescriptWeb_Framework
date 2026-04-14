/**
 * Run once to generate test-data/login-data.xlsx
 * Usage: npx ts-node test-data/create-excel-data.ts
 */
import * as XLSX from 'xlsx';
import * as path from 'path';

const validCredentials = [
  { username: 'Admin', password: 'admin123', scenario: 'admin login', role: 'admin' },
];

const invalidCredentials = [
  { username: 'nonexistent@example.com', password: 'wrongpass123', scenario: 'non-existent user' },
  { username: 'Admin',                   password: 'wrongpassword', scenario: 'wrong password'    },
  { username: 'Admin',                   password: '',              scenario: 'empty password'    },
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(validCredentials),   'ValidCredentials');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(invalidCredentials), 'InvalidCredentials');

const outputPath = path.resolve(__dirname, 'login-data.xlsx');
XLSX.writeFile(wb, outputPath);
console.log(`Created: ${outputPath}`);
