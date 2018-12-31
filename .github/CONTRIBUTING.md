# Contributing

Thanks for your interest in Timezone Butler! We are open to, and grateful for, any contributions made by the community. We want Timezone Butler to be a community endeavor, all of us working together to make timezones irrelevant!

The most important thing to be aware of is that Timezone Butler is a side-project without any full-time staff. As a result, we can't guarantee that issues or pull-requests will be addressed or reviewed in a timely fashion (although we'll certainly try!).

We'd also like to emphasize that, outside of specific cases like quick bug fixes, we'd prefer if **pull requests were opened in response to issues** (and ideally ones that have a consensus already established as to the solution). We don't want to have to reject a pull request because we disagree with the direction or the implementation. For more information, see [Sending a Pull Request](https://github.com/mathieudutour/timezone-butler/blob/master/CONTRIBUTING.md#sending-a-pull-request)

## Reporting Issues and Asking Questions

Before opening an issue, please search the [issue tracker](https://github.com/mathieudutour/timezone-butler/issues) to make sure your issue hasn't already been reported.

### Bugs and Improvements

_Timezone Butler is alpha software_, and you will likely encounter some issues.

We use the issue tracker to keep track of bugs and improvements to Timezone Butler. We encourage you to open issues to discuss improvements, architecture, theory, internal implementation, etc. If a topic has been discussed before, we will ask you to join the previous discussion.

### Sending a Pull Request

Please open an issue with a proposal for a new feature or refactoring before starting on the work, or comment on an existing requested-feature issue. We don't want you to waste your efforts on a pull request that we won't want to accept.

Some changes are exceptions. Examples include tiny bug fixes, clarifying something in the docs, etc. Stuff that is unlikely to be controversial, and easy to review.

In general, the contribution workflow looks like this:

- Find or open a new issue in the [Issue tracker](https://github.com/mathieudutour/timezone-butler/issues).
- Fork the repo.
- Create a new feature branch based off the `master` branch.
- Make sure all tests pass
- Submit a pull request, referencing any issues it addresses.

Please try to keep your pull request focused in scope and avoid including unrelated commits.

After you have submitted your pull request, we'll try to get back to you as soon as possible. We may suggest some changes or improvements.

Thank you for contributing!

## Collaborators

If you contribute a valuable code change, you may receive an invitation to become a collaborator on the Timezone Butler repo. Collaborators are contributors who are given full write access; they can create branches on the repo, merge code, close issues, etc.

We really like the idea of empowering contributors by giving them these privileges. We're trying to build an active community of folks, and it seems like collaborator roles is a great way to encourage that!

This is a new project, and we're still figuring out the conventions, but here's what you need to know about becoming a collaborator:

- You can work directly on the main repo, instead of using your own fork. Create branches for yourself and open pull requests from them. This makes it easier for other collaborators to quickly try out your changes locally, so it's encouraged. Please don't commit directly to `master` though :)
- You can moderate issues, closing ones that are duplicates or not relevant, or reopening ones you feel deserve more discussion
- You can submit code reviews for other folks' changes, accepting or requesting changes.
- When reviewing small changes that don't affect the UI, feel free to merge it in when you feel the code is good to go. At least for now, the owner (@mathieudutour) wants to keep an eye on visual/design changes, so please don't merge in design changes. And for large, non-trivial changes, it might be good to get at least a couple approvals before landing.

When it comes to your own pull requests, please don't accept and/or merge them; we should have at least 1 other pair of eyes on any changes before landing.

It's important to point out that there is **no expectation** of additional work. Feel free to accept the invitation even if you don't think you'll have much time to help contribute. This is about giving people the option to help if they want, not burdening folks with additional responsibilities.

This is an evolving process (collaborators are a new thing for Timezone Butler!), so we'll likely iterate on these conventions as we go.

## Development

Visit the [issue tracker](https://github.com/mathieudutour/timezone-butler/issues) to find a list of open issues that need attention. The best way to contribute is to find something you feel able and willing to tackle. As the project matures we hope to add more "good first contribution" issues for folks newer to NodeJS development.

Fork, then clone the repo:

```bash
git clone https://github.com/your-username/timezone-butler.git
```

### Running

#### Local development server

To get started, install all of Timezone Butler's dependencies with npm. While you can also use yarn for this, we use a `package-lock.json` file to keep everyone's dependency versions consistent.

```bash
npm install
```

Next, run the `dev` task to get the app running locally:

```bash
npm run dev
```

This should create a local server listening on the port 3000.

### Testing

Unfortunately, very little of Timezone Butler is currently tested.

We hope to add more tests in the meantime, but for now you can run the tests with:

```bash
npm run test
```

### Debugging

To help you debug, you can open the chromium developer tools inside the running Electron instance from the `View` menu. You can also toggle the redux developer tools with <kbd>ctrl</kbd>+<kbd>h</kbd> and change their position with <kbd>ctrl</kbd>+<kbd>q</kbd>.

### Docs

Please learn more about Timezone Butler at the project [README](https://github.com/mathieudutour/timezone-butler/blob/master/README.md).
