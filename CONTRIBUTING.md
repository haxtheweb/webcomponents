# Contributing

- [Communication](#communication)
- [GitHub workflow](#github-workflow)
- [Open a Pull Request](#opening-a-pull-request)
- [Code Review](#code-review)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [Security](#security)

HAX is open source, but many of the people working on it do so as their day job.
In order to avoid forcing people to be "at work" effectively 24/7, we want to establish some semi-formal protocols around development.
Hopefully, these rules make things go more smoothly.

As a potential contributor, your changes and ideas are welcome at any hour of the day or night, weekdays, weekends, and holidays.
Please do not ever hesitate to ask a question or send a pull request.

Beginner focused information can be found below in [Open a Pull Request](#opening-a-pull-request) and [Code Review](#code-review).

### Communication

Reporting issues? Our unified issue queue is a good place for this: https://github.com/haxtheweb/issues/issues
Need to discuss something via chat? Our [Discord can be joined here](https://bit.ly/hax-discord).

## GitHub workflow

We work primarily using pull requests and forks. In order to work most effectively, we ask that you FORK any project you are wanting to contribute to in our ecosystem. After taking a fork, submit a pull request while pointing to the associated issue tied to this pull request.

## Opening a Pull Request

Pull requests are often called a "PR".
HAX generally follows the standard [github pull request](https://help.github.com/articles/about-pull-requests/) process.

Common new contributor PR issues are:
- Not referencing the issue that the PR resolves
- Not describing the scope of the solution effectively
- Include mentions (like @person) and [keywords](https://help.github.com/en/articles/closing-issues-using-keywords) which could close the issue (like fixes #xxxx) in commit messages.

## Code Review

To make it easier for your PR to receive reviews, consider the reviewers will need you to:

- Write [good commit messages](https://chris.beams.io/posts/git-commit/)
- Break large changes into a logical series of smaller patches which individually make easily understandable changes, and in aggregate solve a broader issue

When reviewing PRs from others [The Gentle Art of Patch Review](http://sage.thesharps.us/2014/09/01/the-gentle-art-of-patch-review/) suggests an iterative series of focuses which is designed to lead new contributors to positive collaboration without inundating them initially with nuances:

- Is the idea behind the contribution sound?
- Is the contribution architected correctly?
- Is the contribution polished?

Note: if your pull request isn't getting enough attention, you can use our [Discord channel](https://bit.ly/hax-discord) to get help finding reviewers.

## Best practices

- Write clear and meaningful git commit messages.
- If the PR will *completely* fix a specific issue, include `fixes #123` in the PR body (where 123 is the specific issue number the PR will fix. This will automatically close the issue when the PR is merged.
- Make sure you don't include `@mentions` or `fixes` keywords in your git commit messages. These should be included in the PR body instead.
- When you make a PR for small change (such as fixing a typo, style change, or grammar fix), please squash your commits so that we can maintain a cleaner git history.
- Make sure you include a clear and detailed PR description explaining the reasons for the changes, and ensuring there is sufficient information for the reviewer to understand your PR.
- Additional Readings: 
    - [chris.beams.io/posts/git-commit/](https://chris.beams.io/posts/git-commit/)
    - [github.com/blog/1506-closing-issues-via-pull-requests ](https://github.com/blog/1506-closing-issues-via-pull-requests)
    - [davidwalsh.name/squash-commits-git ](https://davidwalsh.name/squash-commits-git)
    - [https://mtlynch.io/code-review-love/](https://mtlynch.io/code-review-love/)

## Testing

Unit tests are ideal but not required to be written for proposed changes and enhancements.

## Security

If you discover what you deem to be a critical security issue  please reach out on our Discord channel privately to discuss whether this should be resolved in the open prior or if disclosure should happen after a solution has been crafted.
