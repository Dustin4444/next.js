# Maintenance

This document describes the maintenance infrastructure and tools available for Next.js development.

## Overview

The maintenance module provides standardized tools for security auditing, dependency verification, and platform-specific deployments. It was inspired by the Bitcoin Core GUI project's [Maintenance.cmake module](https://github.com/bitcoin-core/gui/commit/747adb6ffe9b06d476fc5eaebbaf9a62b91a78c5), adapted for the JavaScript/Node.js ecosystem.

## Available Commands

### Security Checks

Before committing changes or releasing, run security audits:

```bash
pnpm check-security
```

This command checks for known vulnerabilities in dependencies and identifies outdated packages.

### Dependency Verification

Verify package integrity and check for duplicates:

```bash
pnpm check-symbols
```

### Run All Checks

Execute all maintenance checks at once:

```bash
pnpm check-maintenance
```

## Integration with Development Workflow

### Before Committing

Run maintenance checks to ensure code quality:

```bash
pnpm check-maintenance
```

### Before Releasing

Always run security checks before creating a release:

```bash
pnpm check-security
```

### CI/CD Integration

The maintenance commands are designed to be integrated into CI/CD pipelines. Example usage:

```yaml
- name: Run maintenance checks
  run: pnpm check-maintenance
```

## Deployment Targets

For creating platform-specific deployment bundles:

```bash
# Generic deployment (all platforms)
pnpm deploy

# Windows-specific (Windows only)
pnpm deploy-windows

# macOS-specific (macOS only)
pnpm deploy-macos
```

## Additional Information

For detailed documentation about the maintenance module, see [docs/maintenance.md](../../docs/maintenance.md).

## Related Guides

- [Linting](./linting.md)
- [Testing](../core/testing.md)
- [Building](../core/building.md)
