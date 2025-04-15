module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: "conventional-changelog-conventionalcommits",
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "impr",
        "fix",
        "docs",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "style",
        "chore",
        "revert",
      ],
    ],
  },
  prompt: {
    questions: {
      type: {
        description: "Select the type of change that you're committing",
        enum: {
          feat: {
            description:
              "A new feature that adds functionality to the project.",
            title: "Features",
            emoji: "✨",
          },
          impr: {
            description:
              "Improvements or enhancements to an existing feature or functionality.",
            title: "Improvements",
            emoji: "🛠",
          },
          fix: {
            description: "A fix for a bug or issue in the codebase.",
            title: "Bug Fixes",
            emoji: "🐛",
          },
          docs: {
            description:
              "Changes related to documentation, such as fixing typos or adding new information.",
            title: "Documentation",
            emoji: "📚",
          },
          style: {
            description:
              "Code style changes that do not affect functionality (e.g., formatting).",
            title: "Code Style",
            emoji: "🎨",
          },
          refactor: {
            description:
              "Code changes that neither fix a bug nor add a feature but improve code readability or structure.",
            title: "Refactoring",
            emoji: "🔧",
          },
          perf: {
            description: "Changes that improve the performance of the project.",
            title: "Performance",
            emoji: "⚡",
          },
          test: {
            description:
              "Changes related to tests, such as adding or modifying test cases.",
            title: "Tests",
            emoji: "🧪",
          },
          build: {
            description:
              "Changes that affect the build system or external dependencies.",
            title: "Build System",
            emoji: "📦",
          },
          ci: {
            description:
              "Changes to continuous integration (CI) configuration, such as CI tool settings.",
            title: "CI",
            emoji: "🤖",
          },
          chore: {
            description:
              "Other changes that don't apply to any of the above categories (e.g., maintenance tasks).",
            title: "Chores",
            emoji: "🔩",
          },
          revert: {
            description: "Reverts a previous commit or change.",
            title: "Reverts",
            emoji: "⏪",
          },
        },
      },
    },
  },
};
