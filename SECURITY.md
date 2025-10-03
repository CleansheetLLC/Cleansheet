# Security Policy

## Reporting a Vulnerability

The Cleansheet team takes security seriously. We appreciate your efforts to responsibly disclose any security vulnerabilities you find.

---

## How to Report a Security Vulnerability

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please report security vulnerabilities via email to:

**security@cleansheet.dev**

---

## What to Include in Your Report

To help us understand and resolve the issue quickly, please include:

1. **Description of the vulnerability**
   - Type of issue (e.g., XSS, CSRF, injection, authentication bypass)
   - Severity assessment (Critical, High, Medium, Low)

2. **Steps to reproduce**
   - Detailed steps to demonstrate the vulnerability
   - Include URLs, screenshots, or proof-of-concept code if applicable

3. **Potential impact**
   - What could an attacker accomplish?
   - What data or systems are at risk?

4. **Suggested fix** (if available)
   - Proposed remediation or mitigation steps

5. **Your contact information**
   - How we can reach you for follow-up questions
   - Your GitHub username (for recognition, optional)

---

## Response Timeline

- **Initial Response**: Within 48 hours of receiving your report
- **Status Update**: Within 7 days with our assessment and planned actions
- **Resolution**: Timeline depends on severity and complexity
  - Critical: 1-7 days
  - High: 7-30 days
  - Medium: 30-90 days
  - Low: 90+ days or next release cycle

---

## What to Expect

### After You Report

1. **Acknowledgment**: We'll confirm receipt of your report within 48 hours
2. **Assessment**: We'll evaluate the vulnerability and determine severity
3. **Communication**: We'll keep you updated on our progress
4. **Resolution**: We'll develop and deploy a fix
5. **Disclosure**: We'll coordinate public disclosure with you
6. **Recognition**: We'll acknowledge your contribution (if desired)

### Our Commitment

- We will respond to your report promptly
- We will keep you informed of our progress
- We will work with you to understand and resolve the issue
- We will not take legal action against security researchers who:
  - Follow responsible disclosure practices
  - Make a good faith effort to avoid harm
  - Report vulnerabilities promptly

---

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

---

## Security Best Practices

When contributing to this project, please follow these security guidelines:

### Code Security

- **Never commit secrets** (API keys, passwords, tokens)
- **Validate all input** from users and external sources
- **Sanitize output** to prevent XSS attacks
- **Use HTTPS** for all external resources
- **Follow OWASP guidelines** for web application security
- **Keep dependencies updated** and review security advisories

### Data Protection

- **Minimize data collection** - only collect what's necessary
- **Encrypt sensitive data** at rest and in transit
- **Implement proper access controls**
- **Follow GDPR and CCPA requirements**
- **Log security-relevant events**

### Authentication & Authorization

- **Use secure authentication** mechanisms
- **Implement proper session management**
- **Enforce least privilege** principle
- **Validate permissions** on all protected resources
- **Use secure password storage** (bcrypt, argon2)

---

## Known Security Considerations

### Client-Side Application

This is primarily a client-side web application with:

- **Static hosting**: Reduces server-side attack surface
- **External dependencies**: Font Awesome, Google Fonts (from CDN)
- **No authentication**: Public content library (corpus)
- **Future features**: Will include authentication and user data

### Current Security Measures

- **Content Security Policy**: To be implemented
- **Subresource Integrity**: To be implemented for CDN resources
- **HTTPS enforcement**: Required for production deployment
- **Input validation**: Implemented on search and filter features
- **XSS prevention**: HTML sanitization on user-generated content

---

## Security Vulnerabilities We're Interested In

### In Scope

- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Authentication/Authorization bypass
- SQL Injection (if applicable)
- Information disclosure
- Denial of Service (DoS)
- Security misconfigurations
- Insecure dependencies

### Out of Scope

- Social engineering attacks
- Physical security
- Attacks requiring physical access
- Issues in third-party services (report directly to them)
- Issues already reported or known
- Issues in unsupported versions

---

## Disclosure Policy

### Responsible Disclosure

We follow a coordinated disclosure approach:

1. **Private disclosure**: Vulnerability is reported privately
2. **Investigation**: We investigate and develop a fix
3. **Fix deployment**: We deploy the fix to production
4. **Public disclosure**: We publish a security advisory (typically 90 days after fix)
5. **Credit**: We acknowledge the reporter (with permission)

### When We Disclose

We will publicly disclose security vulnerabilities:

- After a fix has been deployed
- After sufficient time for users to update (typically 90 days)
- Or as agreed with the reporter

### Security Advisories

Security advisories will be published:

- In GitHub Security Advisories
- In release notes
- On our website (cleansheet.info)

---

## Security Hall of Fame

We recognize security researchers who help us keep Cleansheet secure:

*(This section will be updated as vulnerabilities are responsibly disclosed and resolved)*

---

## Bug Bounty Program

We do not currently offer a bug bounty program. However, we deeply appreciate security researchers who responsibly disclose vulnerabilities and will:

- Acknowledge your contribution publicly (with permission)
- Add you to our Security Hall of Fame
- Provide a detailed write-up of the fix (if desired)

---

## Security Updates

To stay informed about security updates:

- **Watch this repository** for security advisories
- **Subscribe to releases** on GitHub
- **Follow** [@cleansheet](https://www.cleansheet.info) (if applicable)
- **Check** our website regularly: [cleansheet.info](https://www.cleansheet.info)

---

## Contact

For security-related questions or concerns:

- **Email**: security@cleansheet.dev
- **Response time**: Within 48 hours
- **PGP key**: Available on request

For general support:

- **Website**: [cleansheet.info](https://www.cleansheet.info)
- **Repository**: [github.com/CleansheetLLC/Cleansheet](https://github.com/CleansheetLLC/Cleansheet)

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Contributor Covenant](https://www.contributor-covenant.org/)

---

**Thank you for helping keep Cleansheet and our users safe!**

---

**Last Updated**: 2025-10-03

© 2025 Cleansheet LLC. All rights reserved.
