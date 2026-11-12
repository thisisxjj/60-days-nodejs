# Fork 开源协作 Git 工作流：LazyGit 版本

适用于：

```text
origin   = 你的 fork 仓库
upstream = 原始开源项目仓库
```

本流程基于本机 LazyGit 自定义菜单：

```text
X = Fork workflow
```

## 1. 前置配置

推荐全局 Git 配置：

```bash
git config --global pull.ff only
```

如果仓库还没有 `upstream`，先添加：

```bash
git remote add upstream https://github.com/OWNER/REPO.git
```

当前 LazyGit 自定义菜单已写入：

```text
~/.config/lazygit/config.yml
```

## 2. 自定义快捷键

按 `X` 打开 `Fork workflow` 菜单。

| 快捷键 | 动作 |
|---|---|
| `X s` | 同步本地默认分支到 `upstream` 默认分支，再推送到 `origin` |
| `X n` | 同步默认分支后创建新功能分支 |
| `X r` | 同步默认分支后，把当前功能分支 rebase 到默认分支 |
| `X p` | 在功能分支上使用 `git push --force-with-lease` 安全推送 |

## 3. 同步默认分支

快捷键：

```text
X s
```

等价命令：

```bash
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
git switch "$default_branch"
git merge --ff-only "upstream/$default_branch"
git push origin "$default_branch"
```

含义：

```text
fetch 更新 upstream 远端追踪分支
set-head 更新本地 upstream/HEAD
merge --ff-only 更新本地默认分支
push 更新 origin 默认分支
```

默认分支通常是 `main` 或 `master`，由 `upstream/HEAD` 自动识别。

如果工作区有未提交改动，命令会拒绝执行。先提交或 stash 后再同步。

## 4. 新开功能分支

快捷键：

```text
X n
```

输入分支名，例如：

```text
feat/some-feature
```

等价命令：

```bash
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
git switch "$default_branch"
git merge --ff-only "upstream/$default_branch"
git push origin "$default_branch"
git switch -c feat/some-feature
```

常见分支命名：

```text
feat/some-feature
fix/some-bug
docs/update-readme
refactor/some-module
test/add-coverage
```

## 5. 开发并提交

继续使用 LazyGit 原生操作。

进入 Files 面板：

```text
2
```

暂存全部改动：

```text
a
```

提交：

```text
c
```

输入提交信息，例如：

```text
feat: add some feature
```

## 6. 第一次推送功能分支

在当前功能分支上按：

```text
P
```

第一次推送时，LazyGit 会提示设置 upstream。选择：

```text
origin
```

这等价于：

```bash
git push -u origin feat/some-feature
```

这一步会创建远端分支：

```text
origin/feat/some-feature
```

之后该分支再按 `P`，就会直接推送到 `origin/feat/some-feature`。

## 7. 创建 Pull Request

功能分支必须先推送到 `origin`，再创建 PR。

进入 Branches 面板：

```text
3
```

选中当前功能分支：

```text
feat/some-feature
```

创建 PR：

```text
o
```

如果默认目标不对，用：

```text
O
```

目标应该是：

```text
你的 fork:feat/some-feature -> upstream:<default-branch>
```

## 8. PR 期间跟上 upstream

在功能分支上按：

```text
X r
```

等价命令：

```bash
current_branch=$(git branch --show-current)
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
git switch "$default_branch"
git merge --ff-only "upstream/$default_branch"
git push origin "$default_branch"
git switch "$current_branch"
git rebase "$default_branch"
```

如果当前在默认分支，命令会拒绝执行。必须先切到功能分支。

如果工作区有未提交改动，命令会拒绝执行。先提交或 stash。

## 9. rebase 后推送

rebase 会改写 commit hash，所以要安全强推。

快捷键：

```text
X p
```

LazyGit 会要求确认。

等价命令：

```bash
current_branch=$(git branch --show-current)
if [ -z "$current_branch" ]; then
  printf '%s\n' 'Detached HEAD. Checkout a branch first.'
  exit 1
fi
git fetch upstream
git remote set-head upstream -a
default_ref=$(git symbolic-ref --quiet --short refs/remotes/upstream/HEAD)
default_branch=${default_ref#upstream/}
if [ "$current_branch" = "$default_branch" ]; then
  printf '%s\n' 'Already on the default branch. Checkout a feature branch first.'
  exit 1
fi
git push --force-with-lease
```

如果当前在 detached HEAD 或默认分支，命令会拒绝执行。

不要使用普通 `git push --force`。

## 10. rebase 冲突处理

如果 `X r` 后出现冲突，进入 Files 面板：

```text
2
```

编辑冲突文件：

```text
e
```

解决后暂存：

```text
a
```

继续 rebase：

```text
m
```

选择 continue。

放弃 rebase：

```text
m
```

选择 abort。

## 11. Review 后继续修改

继续在同一个功能分支修改。

```text
2
a
c
P
```

如果期间又执行过 `X r`，推送时使用：

```text
X p
```

## 12. PR 合并后清理

先同步默认分支：

```text
X s
```

删除本地功能分支：

```text
3
选中 feat/some-feature
d
<enter>
```

删除 fork 上的远端功能分支：

```text
切到 remote branches tab
选中 origin/feat/some-feature
d
<enter>
```

等价命令：

```bash
git branch -d feat/some-feature
git push origin --delete feat/some-feature
```

## 13. 完整流程

新开 PR：

```text
X n
输入 feat/some-feature
2
a
c
P
选择 origin
3
选中 feat/some-feature
o
```

PR 跟上 upstream：

```text
X r
X p
```

Review 后继续提交：

```text
2
a
c
P
```

PR 合并后：

```text
X s
3
选中 feat/some-feature
d
<enter>
切到 remote branches tab
选中 origin/feat/some-feature
d
<enter>
```

## 14. 核心原则

```text
默认分支只同步 upstream
feature 才写代码
同步默认分支用 merge --ff-only
feature 跟上默认分支用 rebase
第一次 push 选择 origin
rebase 后 push 用 --force-with-lease
```
