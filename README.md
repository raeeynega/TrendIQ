# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Pushing to GitHub

You can push your code to a new or existing GitHub repository to save your work and collaborate with others.

### For a new repository

1.  Go to [github.com/new](https://github.com/new) to create a new repository. You can skip adding a `README`, `.gitignore`, or license file since this project already has them.

2.  In your local project terminal, run the following commands to initialize a Git repository and push your code. Replace `<YOUR_REPOSITORY_URL>` with the URL you got from GitHub (it looks like `https://github.com/user/repo.git`).

    ```bash
    # Initialize a local Git repository
    git init -b main

    # Add all files to be tracked
    git add .

    # Create your first commit
    git commit -m "Initial commit"

    # Add your GitHub repository as the remote origin
    git remote add origin <YOUR_REPOSITORY_URL>

    # Push your code to GitHub
    git push -u origin main
    ```

Now your code is on GitHub! To save future changes, just run `git add .`, `git commit -m "Your commit message"`, and `git push`.