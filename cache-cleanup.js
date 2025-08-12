#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Aggressive cache cleanup utility for Windows Next.js development
 * Prevents Internal Server Errors caused by Windows file system issues
 */

const projectDir = __dirname;
const nextDir = path.join(projectDir, '.next');
const nodeModulesCacheDir = path.join(projectDir, 'node_modules', '.cache');

console.log('🧹 Starting aggressive cache cleanup...');

function removeDirectoryRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      // Windows-specific aggressive removal
      if (process.platform === 'win32') {
        const { execSync } = require('child_process');
        execSync(`rmdir /s /q "${dirPath}"`, { stdio: 'ignore' });
      } else {
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
      console.log(`✅ Cleaned: ${dirPath}`);
      return true;
    } catch (error) {
      console.warn(`⚠️ Could not clean ${dirPath}:`, error.message);
      return false;
    }
  }
  return true;
}

function cleanupCache() {
  console.log('📂 Cleaning Next.js cache...');
  removeDirectoryRecursive(nextDir);
  
  console.log('📂 Cleaning Node modules cache...');
  removeDirectoryRecursive(nodeModulesCacheDir);
  
  // Clean any lingering temp files
  const tempFiles = [
    '.next-cache',
    'node_modules/.cache',
    '.turbo',
    'dist'
  ];
  
  tempFiles.forEach(file => {
    const fullPath = path.join(projectDir, file);
    removeDirectoryRecursive(fullPath);
  });
  
  // Wait a moment for Windows file system
  setTimeout(() => {
    console.log('✨ Cache cleanup complete!');
    console.log('🚀 Ready to start development server...');
  }, 1000);
}

// Run cleanup
cleanupCache();

module.exports = { cleanupCache, removeDirectoryRecursive };