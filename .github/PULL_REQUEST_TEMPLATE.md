<!-- 在这里填写 PR 说明 -->

---

### 提交前请确认以下事项（请勿删除）

- [ ] PR 已关联对应 Issue 或已有讨论；大型变更请先发起 RFC。
- [ ] 描述清楚解决的问题与影响范围。
- [ ] 理想情况下包含一个在未合入前失败、合入后通过的测试。

### Tests

- [ ] 已运行 `bun run ci`（lint → typecheck → test → build → check:exports）

### Changesets

- [ ] 如果变更需要记录在变更日志中，请运行 `bunx changeset add` 并按提示生成变更集。
- [ ] 在 `0.1.0` 发布前，新增功能与修复建议使用 `patch` 类型，并在说明中使用 `feat:` / `fix:` / `chore:` 前缀。

### Edits

- [ ] 已勾选 "Allow edits from maintainers"，以便维护者协助修改。
