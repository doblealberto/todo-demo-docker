# Todo App
### You could find the deployed version of the app at: https://doblealberto.github.io/todo-app/

Todo app is a simple ReactJs App deployed to github pages with the power of github actions!
- [Getting started](#getting-started)
- [Deployment configuration](#Deployment-configuration)
- [About the actions](#Actions)

![Example Image](https://drive.google.com/uc?id=1VsJwB_65ONGgvMNBziPBzWlDyXw4RYzw)

## Getting started
## Features:
- Allows to delete todos
- Allows to mark todos as done
- Completed todos counter

## Run the app locally:
```zsh
npm install 
npm run start
```
### Deployment configuration
To have the application ready for putting into production via github pages you must edit your `package.json` file
adding the next line of code:
```javascript
  "homepage": "https://doblealberto.github.io/todo-app/",
```
As you can see the homepage key refeers to: `<your github user>/<the-name-of-your-app>`

### About the workflows
This application contains two workflows under the `./github/worflows directory`
first one was named: deploy.yml
#### Deploy.yml
Is in charge to put our applications into github pages environment
```javascript
name: Build and Deployment
on:
  push:
    branches:
      - main
permissions:
  contents: write
```
This action will execute when a push event has been done to the main branch, you also grant permissions of write
to this workflow

```javascript
jobs:
  build-and-deploy:
    name: Builds assets for the project
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3

      - name: Install and Build 🔧 #  Project is built using npm and outputs the result to the 'build' folder.
        run: |
          npm ci
          npm run build

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: build # The folder the action should deploy.
```
The workflow contains one job wich is called `build-and-deploy`, for the `first-step` the workflow makes use of the checkout actions, which copies the code available in the repo, this action can be find via the actions marketplaces, actions are little pieces of code that execute specific tasks

then for the `install and build` step we run certain comands (notice how to make use of the `|` operator that allows
you to run multiline comands), `npm ci` command is intended to create a "clean installation" wich is suitable for automated environments

last but not least we have `Deploy` step which takes the `JamesIves/github-pages-deploy-action@v4` and via the with tag
adds certain configuration like the branch we are going to use. And the folder where the build artifacts were added in this case `build` 

#### Update.yml
This workflow is intend to promote the use of gitflow.
According to atlassian tutorials gitflow can be summarized as follows:


        A develop branch is created from main
        A release branch is created from develop
        Feature branches are created from develop
        When a feature is complete it is merged into the develop branch
        When the release branch is done it is merged into develop and main
        If an issue in main is detected a hotfix branch is created from main
        Once the hotfix is complete it is merged to both develop and main
        
As we see the common piece is that every work gets integreted to either `develop or main` branches, considering main
as the source of truth for the repo.
To achieve a cleaner gitflow 
![Example Image](https://drive.google.com/uc?id=1IpqbVBILcGZp8PgaOBGiR8ufQGoi9fvQ)At this moment It is required to approve the pull request from any branch to `main`.
It is neccesary to consideer that our stable production version lives in this branch since `deploy.ytml` only runs when
the `main` branch is being pushed.

What the actions does is that when a pull request is closed to the target branch `main` in this case.
```javascript
on:
  pull_request:
    types:
      - closed
    branches:
      - main
```
It will go for two jobs:
```javascript
jobs:

  merge-to-develop:
    runs-on: ubuntu-latest
    if: ((startsWith(github.head_ref, 'feature') || startsWith(github.head_ref, 'hotfix') || startsWith(github.head_ref, 'release')) && github.event.pull_request.merged == true)
    steps:
      - uses: actions/checkout@master

      - name: merge_temp -> develop
        uses: devmasx/merge-branch@master
        with:
          type: now
          from_branch: ${{ github.head_ref }}
          target_branch: develop
          github_token: ${{ github.token }}

   delete-branch:
        runs-on: ubuntu-latest
        needs: merge-to-develop
        steps:
          - name: Delete temp branch ❌ # This example project is built using npm and outputs the result to the 'build' folder. Replace with the commands required to build your project, or remove this step entirely if your site is pre-built.
            uses: dawidd6/action-delete-branch@v3
            with:
              github_token: ${{github.token}}
              branches: ${{ github.head_ref }}
```
first one `merge-to-develop` will check for the following condition:
```javascript
((startsWith(github.head_ref, 'feature') || startsWith(github.head_ref, 'hotfix') || startsWith(github.head_ref, 'release')) && github.event.pull_request.merged == true)
```
which compares if any of the head_refs begins with the words: `feature`, `hotfix` or `release` AND if the `pull request`
was merged successfully, if this conditionals are true then we will make use of the `devmasx/merge-branch@master` action
that merge one branch into another by taking: `from_branch: ${{ github.head_ref }}` and `target_branch: develop` as the most important parameters which will mantain our `develop` and `main` branches up to date.

Last step is to use the: `delete-branch` step that will maintain a more cleaner repo.`notice` how we make use of the `needs: merge-to-develop`  tag this shows that for the deletion of the `head_ref` branch first step must succed.
`uses: dawidd6/action-delete-branch@v3` declares the action that was took from the marketplace and we pass the
```javascript
with:
              github_token: ${{github.token}}
              branches: ${{ github.head_ref }}
```
as the most important configuration parameters.












