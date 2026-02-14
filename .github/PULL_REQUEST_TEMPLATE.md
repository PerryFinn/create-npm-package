<!-- 在这里填写 PR 说明 -->

---

### 提交前请确认以下事项（请勿删除）

- [ ] PR 已关联对应 Issue 或已有讨论；大型变更请先发起 RFC。
- [ ] 描述清楚解决的问题与影响范围，并说明涉及的 workspace（`core` / `utils` / `cli`）。
- [ ] 理想情况下包含一个在未合入前失败、合入后通过的测试。

### Tests

- [ ] 已运行 `bun run ci`（lint → check:type → test → build → check:exports）
- [ ] 如为局部改动，已额外运行对应 workspace 的命令（例如 `bun run --filter @perryfinn/utils test`）

### Changesets

- [ ] 如果变更需要记录在变更日志中，请运行 `bunx changeset add` 并按提示生成变更集。
- [ ] 变更集中的包名使用当前 workspace 包名（如 `@perryfinn/core`、`@perryfinn/utils`、`@perryfinn/cli`）。

### Edits

- [ ] 已勾选 "Allow edits from maintainers"，以便维护者协助修改。
