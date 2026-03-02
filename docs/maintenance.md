# Next.js Maintenance Module

This document describes the maintenance infrastructure for Next.js, providing tools for security checks, dependency auditing, and platform-specific deployment.

## Overview

The maintenance module was inspired by the Bitcoin Core GUI project's [Maintenance.cmake module](https://github.com/bitcoin-core/gui/commit/747adb6ffe9b06d476fc5eaebbaf9a62b91a78c5), adapted for the JavaScript/Node.js ecosystem and Next.js-specific workflows.

## Available Commands

### Security Checks

Run security audits on project dependencies:

```bash
pnpm check-security
```

This command:
- Runs `pnpm audit` to check for known vulnerabilities
- Lists outdated packages that may need updates
- Reports security issues at moderate severity and above

### Symbol and Dependency Checks

Verify package integrity and check for duplicate dependencies:

```bash
pnpm check-symbols
```

This command:
- Lists installed dependencies
- Checks for duplicate packages in the dependency tree
- Verifies package integrity against lockfile

### All Maintenance Checks

Run all maintenance checks at once:

```bash
pnpm check-maintenance
```

This runs all the above checks in sequence.

### Deployment Targets

#### Windows Deployment

Create a Windows deployment bundle (Windows only):

```bash
pnpm deploy-windows
```

#### macOS Deployment

Create a macOS deployment bundle (macOS only):

```bash
pnpm deploy-macos
```

#### Platform-Specific Deployment

Create a deployment bundle for the current platform:

```bash
pnpm deploy
```

## Direct Script Usage

You can also run the maintenance script directly:

```bash
node scripts/maintenance.js <command>
```

Available commands:
- `check-security` - Run security audit
- `check-symbols` - Check dependencies
- `check-all` - Run all checks
- `deploy-windows` - Windows deployment
- `deploy-macos` - macOS deployment
- `deploy` - Platform-specific deployment
- `help` - Show help message

## Integration with CI/CD

The maintenance commands can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run maintenance checks
  run: pnpm check-maintenance

- name: Security audit
  run: pnpm check-security
```

## Comparison with Bitcoin Core

The Next.js maintenance module provides similar functionality to Bitcoin Core's Maintenance.cmake:

| Bitcoin Core (CMake) | Next.js (Node.js) |
|---------------------|-------------------|
| `setup_split_debug_script()` | Source maps for debugging |
| `test-security-check` target | `pnpm check-security` |
| `check-symbols` target | `pnpm check-symbols` |
| `add_windows_deploy_target()` | `pnpm deploy-windows` |
| `add_macos_deploy_target()` | `pnpm deploy-macos` |

## Implementation Details

The maintenance module is implemented in `scripts/maintenance.js` and provides:

1. **Security Auditing**: Uses `pnpm audit` to scan for vulnerabilities
2. **Dependency Verification**: Ensures package integrity and checks for duplicates
3. **Platform Detection**: Automatically detects the OS and provides platform-specific features
4. **Build Integration**: Integrates with existing Next.js build processes

## Future Enhancements

Potential improvements to the maintenance module:

- [ ] Add automated dependency update checks
- [ ] Integrate with GitHub Dependabot alerts
- [ ] Add custom security rules for Next.js-specific patterns
- [ ] Implement bundle size tracking
- [ ] Add performance regression detection
- [ ] Create Docker deployment targets

## Contributing

When adding new maintenance features, please:

1. Add the command to `scripts/maintenance.js`
2. Update this documentation
3. Add the npm script to `package.json`
4. Test the command on relevant platforms
5. Update CI/CD configurations if needed

## References

- Original inspiration: [Bitcoin Core GUI Maintenance Module](https://github.com/bitcoin-core/gui/commit/747adb6ffe9b06d476fc5eaebbaf9a62b91a78c5)
- Next.js Documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
- PNPM Documentation: [https://pnpm.io](https://pnpm.io)
