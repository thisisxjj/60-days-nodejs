# Fork 开源协作 Git 工作流

适用于：

```text
origin   = 你的 fork 仓库
upstream = 原始开源项目仓库
```

推荐全局配置：

```bash
git config --global pull.ff only
```

这样 `git pull` 默认只允许 fast-forward，避免自动产生 merge commit。

## 1. 查看和配置远端

查看当前远端：

```bash
git remote -v
```

如果还没有 `upstream`，添加原项目仓库：

```bash
git remote add upstream https://github.com/OWNER/REPO.git
```

确认配置：

```bash
git remote -v
```

## 2. 同步本地默认分支

每次开始新任务前，先同步 `upstream` 的默认分支。默认分支通常是 `main` 或 `master`。

```bash
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
git switch "$default_branch"
git merge --ff-only "upstream/$default_branch"
git push origin "$default_branch"
```

说明：`git remote set-head upstream -a` 会把 upstream 的默认分支记录到本地的 `upstream/HEAD`。

如果你已经确认项目默认分支是 `main`，也可以简写为：

```bash
git switch main
git pull upstream main
git push origin main
```

因为已经设置了 `git config --global pull.ff only`，所以 `git pull upstream main` 默认就是 fast-forward only。

## 3. 创建功能分支

不要直接在默认分支上开发。

```bash
git switch -c feat/some-feature
```

常见分支命名：

```bash
feat/some-feature
fix/some-bug
docs/update-readme
refactor/some-module
test/add-coverage
```

## 4. 开发并提交

查看改动：

```bash
git status
```

暂存改动：

```bash
git add .
```

提交：

```bash
git commit -m "feat: add some feature"
```

常见提交信息：

```bash
feat: add user profile page
fix: handle empty response
refactor: simplify auth flow
```

## 5. 第一次推送功能分支

```bash
git push -u origin feat/some-feature
```

`-u` 是 `--set-upstream` 的简写。

它会把本地分支：

```text
feat/some-feature
```

和远端分支：

```text
origin/feat/some-feature
```

绑定起来。

之后在这个分支上可以直接使用：

```bash
git push
```

不用每次都写：

```bash
git push origin feat/some-feature
```

## 6. 创建 Pull Request

在 GitHub 上创建 PR：

```text
你的 fork:feat/some-feature -> upstream:<default-branch>
```

PR 目标应该是原项目的默认分支：

```text
upstream/<default-branch>
```

不要把 PR 开到自己的 fork 仓库里。

## 7. PR 期间同步 upstream 更新

如果 upstream 的默认分支有新提交，先更新本地默认分支：

```bash
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
git switch "$default_branch"
git merge --ff-only "upstream/$default_branch"
git push origin "$default_branch"
```

然后更新你的功能分支：

```bash
git switch feat/some-feature
git rebase "$default_branch"
```

如果没有冲突，直接推送：

```bash
git push --force-with-lease
```

## 8. rebase 冲突处理

如果 `rebase` 过程中出现冲突，先查看状态：

```bash
git status
```

手动解决冲突后：

```bash
git add .
git rebase --continue
```

如果想放弃这次 rebase：

```bash
git rebase --abort
```

rebase 完成后推送：

```bash
git push --force-with-lease
```

## 9. 为什么 rebase 后要用 --force-with-lease

`rebase` 会改写提交历史。

原来可能是：

```text
A - B - C
```

rebase 后会变成：

```text
A' - B' - C'
```

虽然代码内容可能一样，但 commit hash 已经变了。

普通推送：

```bash
git push
```

会被拒绝，因为远端分支历史和本地分支历史不同。

所以需要：

```bash
git push --force-with-lease
```

不要用：

```bash
git push --force
```

原因是 `--force` 会直接覆盖远端分支，可能误删别人推送的提交。

`--force-with-lease` 会先检查远端分支是否被别人更新过：

```text
远端没有变化 -> 允许覆盖
远端已经变化 -> 拒绝推送
```

所以它比 `--force` 安全。

## 10. Review 后继续修改

如果 PR 被 review 后需要修改：

```bash
git switch feat/some-feature
git status
git add .
git commit -m "fix: address review feedback"
git push
```

如果期间 upstream 又更新了：

```bash
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
git switch "$default_branch"
git merge --ff-only "upstream/$default_branch"
git push origin "$default_branch"
git switch feat/some-feature
git rebase "$default_branch"
git push --force-with-lease
```

## 11. PR 合并后清理

PR 合并后，同步本地和 fork 的默认分支：

```bash
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
git switch "$default_branch"
git merge --ff-only "upstream/$default_branch"
git push origin "$default_branch"
```

删除本地功能分支：

```bash
git branch -d feat/some-feature
```

删除 fork 上的远端功能分支：

```bash
git push origin --delete feat/some-feature
```

## 12. 完整常用流程

### 新开一个 PR

```bash
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
git switch "$default_branch"
git merge --ff-only "upstream/$default_branch"
git push origin "$default_branch"
git switch -c feat/some-feature
git add .
git commit -m "feat: add some feature"
git push -u origin feat/some-feature
```

### PR 需要跟上 upstream

```bash
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
git switch "$default_branch"
git merge --ff-only "upstream/$default_branch"
git push origin "$default_branch"
git switch feat/some-feature
git rebase "$default_branch"
git push --force-with-lease
```

### Review 后继续提交

```bash
git switch feat/some-feature
git add .
git commit -m "fix: address review feedback"
git push
```

### PR 合并后清理

```bash
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
git switch "$default_branch"
git merge --ff-only "upstream/$default_branch"
git push origin "$default_branch"
git branch -d feat/some-feature
git push origin --delete feat/some-feature
```

## 13. 核心原则

1. 默认分支只用于同步 upstream，不直接开发。
2. 每个 PR 使用一个独立功能分支。
3. 同步默认分支用 `git fetch upstream` + `git merge --ff-only "upstream/$default_branch"`。
4. 功能分支跟上默认分支用 `git rebase "$default_branch"`。
5. 第一次推送功能分支用 `git push -u origin branch-name`。
6. rebase 后推送用 `git push --force-with-lease`。
7. 不要用 `git push --force`。
8. 不要直接 push 到 `upstream`，除非你是维护者。
9. 提交前先阅读项目的 `CONTRIBUTING.md`。
10. PR 里尽量避免无意义的 merge commit。

## 14. 记忆口诀

```text
默认分支用 fetch + ff-only merge
feature 用 rebase
fork 用 push
第一次 push 加 -u
rebase 后 push 用 --force-with-lease
```
