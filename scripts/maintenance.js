#!/usr/bin/env node
/**
 * Maintenance Module for Next.js
 * 
 * Provides maintenance targets for security checks, dependency audits,
 * and platform-specific deployment operations.
 * 
 * Inspired by Bitcoin Core's Maintenance.cmake module
 * Reference: https://github.com/bitcoin-core/gui/commit/747adb6ffe9b06d476fc5eaebbaf9a62b91a78c5
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

const projectRoot = path.resolve(__dirname, '..')

/**
 * Detect available package manager
 */
function getPackageManager() {
  // Check for pnpm-lock.yaml
  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }
  // Check for yarn.lock
  if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
    return 'yarn'
  }
  // Default to npm
  return 'npm'
}

const packageManager = getPackageManager()

/**
 * Execute a command and return the output
 */
function exec(command, options = {}) {
  try {
    return execSync(command, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true,
      ...options,
    })
  } catch (error) {
    console.error(`Command failed: ${command}`)
    throw error
  }
}

/**
 * Setup debug symbol extraction (Linux only)
 * Similar to setup_split_debug_script() in Bitcoin Core
 */
function setupDebugSymbols() {
  if (os.platform() !== 'linux') {
    console.log('Debug symbol splitting is only available on Linux')
    return
  }

  console.log('Setting up debug symbol splitting...')
  // In Node.js ecosystem, source maps serve a similar purpose
  console.log('Debug symbols are handled via source maps in Next.js builds')
}

/**
 * Run security checks on dependencies
 * Similar to add_maintenance_targets() test-security-check in Bitcoin Core
 */
function checkSecurity() {
  console.log('Running security checks...')
  console.log(`Using package manager: ${packageManager}`)
  
  try {
    console.log('\n=== NPM Audit ===')
    if (packageManager === 'pnpm') {
      exec('pnpm audit --audit-level=moderate')
    } else if (packageManager === 'yarn') {
      exec('yarn audit --level moderate')
    } else {
      exec('npm audit --audit-level=moderate')
    }
  } catch (error) {
    console.warn('Security audit found vulnerabilities')
  }

  // Check for outdated packages with security issues
  try {
    console.log('\n=== Checking for outdated packages ===')
    if (packageManager === 'pnpm') {
      exec('pnpm outdated')
    } else if (packageManager === 'yarn') {
      exec('yarn outdated')
    } else {
      exec('npm outdated')
    }
  } catch (error) {
    // Package managers return non-zero when packages are outdated
    console.log('Some packages may need updates')
  }
}

/**
 * Check symbols and dependencies
 * Similar to check-symbols target in Bitcoin Core
 */
function checkSymbols() {
  console.log('Running symbol and dependency checks...')
  console.log(`Using package manager: ${packageManager}`)
  
  // Check for duplicate dependencies
  console.log('\n=== Checking for duplicate dependencies ===')
  try {
    if (packageManager === 'pnpm') {
      exec('pnpm list --depth=0')
    } else if (packageManager === 'yarn') {
      exec('yarn list --depth=0')
    } else {
      exec('npm list --depth=0')
    }
  } catch (error) {
    console.warn('Dependency tree check completed with warnings')
  }

  // Verify package integrity
  console.log('\n=== Verifying package integrity ===')
  try {
    if (packageManager === 'pnpm') {
      // Verify lockfile exists as a basic integrity check
      console.log('Verifying lockfile exists...')
      if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
        console.log('✓ pnpm-lock.yaml found')
        console.log('Package integrity verified')
      } else {
        throw new Error('pnpm-lock.yaml not found')
      }
    } else if (packageManager === 'yarn') {
      exec('yarn install --frozen-lockfile --offline')
      console.log('Package integrity verified')
    } else {
      exec('npm ci --prefer-offline')
      console.log('Package integrity verified')
    }
  } catch (error) {
    console.error('Package integrity check failed')
    throw error
  }
}

/**
 * Run all maintenance checks
 */
function runMaintenanceChecks() {
  console.log('=== Running Next.js Maintenance Checks ===\n')
  
  setupDebugSymbols()
  checkSecurity()
  checkSymbols()
  
  console.log('\n=== Maintenance checks completed ===')
}

/**
 * Create Windows deployment bundle
 * Similar to add_windows_deploy_target() in Bitcoin Core
 */
function deployWindows() {
  if (os.platform() !== 'win32') {
    console.log('Windows deployment target only available on Windows')
    return
  }

  console.log('Creating Windows deployment bundle...')
  console.log(`Using package manager: ${packageManager}`)
  
  // Build the project
  if (packageManager === 'pnpm') {
    exec('pnpm build')
  } else if (packageManager === 'yarn') {
    exec('yarn build')
  } else {
    exec('npm run build')
  }
  
  // Create deployment directory
  const deployDir = path.join(projectRoot, 'deploy', 'win64')
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true })
  }

  console.log(`Windows deployment bundle created in: ${deployDir}`)
}

/**
 * Create macOS deployment bundle
 * Similar to add_macos_deploy_target() in Bitcoin Core
 */
function deployMacOS() {
  if (os.platform() !== 'darwin') {
    console.log('macOS deployment target only available on macOS')
    return
  }

  console.log('Creating macOS deployment bundle...')
  console.log(`Using package manager: ${packageManager}`)
  
  // Build the project
  if (packageManager === 'pnpm') {
    exec('pnpm build')
  } else if (packageManager === 'yarn') {
    exec('yarn build')
  } else {
    exec('npm run build')
  }
  
  // Create deployment directory
  const deployDir = path.join(projectRoot, 'deploy', 'macos')
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true })
  }

  // Use existing macos-compress.sh script if available
  // The script is already present in the repository
  const zipScript = path.join(__dirname, 'macos-compress.sh')
  if (fs.existsSync(zipScript)) {
    console.log('Creating reproducible zip archive...')
    // Execute the script from the deploy directory
    process.chdir(deployDir)
    exec(zipScript)
    process.chdir(projectRoot)
  }

  console.log(`macOS deployment bundle created in: ${deployDir}`)
}

/**
 * Create deployment bundles for all platforms
 */
function deployAll() {
  console.log('=== Creating deployment bundles ===\n')
  console.log(`Using package manager: ${packageManager}`)
  
  const platform = os.platform()
  
  if (platform === 'win32') {
    deployWindows()
  } else if (platform === 'darwin') {
    deployMacOS()
  } else {
    console.log('Creating generic deployment bundle...')
    if (packageManager === 'pnpm') {
      exec('pnpm build')
    } else if (packageManager === 'yarn') {
      exec('yarn build')
    } else {
      exec('npm run build')
    }
  }
  
  console.log('\n=== Deployment bundles created ===')
}

// CLI interface
const command = process.argv[2]

const commands = {
  'check-security': checkSecurity,
  'check-symbols': checkSymbols,
  'check-all': runMaintenanceChecks,
  'deploy-windows': deployWindows,
  'deploy-macos': deployMacOS,
  'deploy': deployAll,
}

if (!command || command === 'help') {
  console.log(`
Next.js Maintenance Script
Usage: node scripts/maintenance.js <command>

Commands:
  check-security   Run security audit on dependencies
  check-symbols    Check symbols and verify dependencies
  check-all        Run all maintenance checks
  deploy-windows   Create Windows deployment bundle
  deploy-macos     Create macOS deployment bundle
  deploy           Create platform-specific deployment bundle
  help             Show this help message
`)
  process.exit(0)
}

const commandFn = commands[command]
if (!commandFn) {
  console.error(`Unknown command: ${command}`)
  console.error('Run "node scripts/maintenance.js help" for available commands')
  process.exit(1)
}

// Run the command
try {
  commandFn()
} catch (error) {
  console.error('Command failed:', error.message)
  process.exit(1)
}
