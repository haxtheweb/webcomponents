# Contributor License Agreement (CLA) Process

## How it Works

This repository uses an automated CLA (Contributor License Agreement) process to ensure legal compliance for all contributions. Here's how it works:

### For New Contributors

1. **Open a Pull Request**: When you submit your first pull request, the CLA bot will automatically post a comment asking you to sign the CLA.

2. **Sign the CLA**: To sign the CLA, simply comment on your pull request with:
   ```
   I have read the CLA Document and I hereby sign the CLA
   ```

3. **Automatic Processing**: Once you sign, the bot will:
   - Record your signature in the repository
   - Update the pull request status
   - Allow your PR to proceed with the review process

### For Returning Contributors

If you've already signed the CLA for this repository, you don't need to sign it again for future pull requests. The bot will automatically recognize you as a signed contributor.

### Important Notes

- **Exact Comment Required**: You must use the exact comment text: `I have read the CLA Document and I hereby sign the CLA`
- **Read the CLA**: Please read the [full CLA document](./CLA.md) before signing
- **One-Time Process**: You only need to sign once per repository
- **Bot Users**: Automated bot users are automatically allowlisted and don't need to sign

### Troubleshooting

If you're having issues with the CLA process:

1. **Re-check Status**: Comment `recheck` on your pull request to have the bot re-evaluate your CLA status
2. **Contact Maintainers**: If problems persist, mention a maintainer in your pull request

### Technical Details

- CLA signatures are stored in `signatures/version1/cla.json` in this repository
- The CLA bot is implemented using the [contributor-assistant/github-action](https://github.com/contributor-assistant/github-action)
- No third-party services are used; everything is handled within GitHub

---

**Questions?** Feel free to open an issue or ask in your pull request if you need help with the CLA process.