好的，这是一个对 `mcp-sse-proxy/proxy-in-middle` 项目的全面总结。

---

### 项目概述

该项目名为 **MCP MiP Proxy** (`@evaa/proxy-in-middle`)，是一个用 **Node.js/TypeScript** 构建的多功能代理和网关。其核心目标是解决 **模型上下文协议 (Model Context Protocol, MCP)** 中不同通信方式的互操作性问题。

主要功能是：
1.  **协议桥接**：在多种通信协议之间进行转换，如 `stdio` (标准输入输出)、`sse` (Server-Sent Events)、`ws` (WebSocket) 和 `streamableHttp`。
2.  **服务聚合**：通过一个配置文件，同时运行和管理多个后端的 MCP 服务，并将它们统一聚合到单个端点供客户端使用。

该项目被完全 **Docker化**，提供了便捷的脚本来进行部署、配置管理和测试，极大地简化了使用和维护流程。

### 核心功能

*   **多协议支持**：支持多种输入和输出协议的组合，例如：
    *   `config` -> `sse` / `ws` / `streamableHttp` (聚合多个服务)
    *   `stdio` -> `sse` / `ws` / `streamableHttp` (将命令行工具网络化)
    *   `sse` -> `stdio` / `ws` (将网络服务转换为其他形式)
    *   `streamableHttp` -> `stdio` / `sse`
*   **强大的配置管理**：
    *   提供了一个强大的 `manage-config.sh` 脚本，用于列出、切换、创建、编辑和重载不同的配置。
    *   支持通过 `.env` 文件、环境变量或直接替换文件的方式手动管理配置。
    *   所有配置更改都需要重启容器才能生效，确保了状态的一致性。
*   **Docker化环境**：
    *   使用 `Dockerfile` 进行多阶段构建，生成一个优化的、非 root 用户的生产镜像。
    *   通过 `docker-compose.yml` 编排服务，管理端口、卷和环境变量。
    *   提供 `start-docker.sh` 和 `test-docker.sh` 等脚本，实现一键启动和测试。
*   **服务聚合与路由**：
    *   `mcpServerManager.ts` 是核心的管理器，它能够根据配置文件启动和管理多个后端 MCP 服务（如 `filesystem` 和 `github`）。
    *   当收到 `tools/call` 或 `resources/read` 等请求时，它能智能地将请求路由到正确的后端服务。路由通过约定的命名格式实现（如 `serverName.toolName`）。
*   **工具过滤与访问控制**：
    *   配置文件支持 `hiddenTools` 和 `exposed` 字段，允许精细化控制哪些工具对客户端可见，提供了安全性和访问控制能力。
*   **热重载能力**：
    *   代码层面实现了对配置文件变化的监听 (`ConfigWatcher`) 和动态的服务重载 (`McpServerManager.reloadConfig`)。虽然提供的管理脚本 (`manage-config.sh`) 采用更简单的重启策略，但项目本身具备热重载的底层能力。

### 技术栈

*   **后端**：Node.js, TypeScript
*   **Web 框架**：Express.js
*   **核心协议库**：`@modelcontextprotocol/sdk`
*   **WebSocket**：`ws` 库
*   **部署**：Docker, Docker Compose
*   **构建/打包**：`tsc` (TypeScript Compiler)

### 运行与部署

项目主要通过 Docker 运行，并提供了一系列便捷的 shell 脚本。

1.  **启动服务**:
    ```bash
    ./start-docker.sh
    ```
    此脚本会构建 Docker 镜像并以后台模式启动服务。

2.  **管理配置**:
    ```bash
    # 查看可用配置
    ./manage-config.sh list
    # 切换到仅文件系统的配置
    ./manage-config.sh switch filesystem-only
    # 重载当前配置 (通过重启容器)
    ./manage-config.sh reload
    ```

3.  **测试服务**:
    ```bash
    ./test-docker.sh
    ```
    此脚本会检查容器状态、测试 `/health` 等端点并显示最近的日志。

4.  **停止服务**:
    ```bash
    docker compose down
    ```

服务默认监听 `3006` 端口，并提供 `/health`、`/sse`、`/message` 等端点。

### 架构设计

*   **容器化架构**：
    *   `Dockerfile` 使用多阶段构建，最终镜像仅包含生产依赖和编译后的代码，体积小且安全。
    *   `docker-compose.yml` 负责挂载配置文件 (`mcpconfig-example.json`, `configs/`) 和日志目录 (`logs/`)，并通过环境变量 (`MCP_CONFIG`) 控制启动时使用的配置。
    *   `entrypoint.sh` 作为容器入口点，它会读取 `MCP_CONFIG` 环境变量，并将对应的配置文件路径传递给 Node.js 应用，这是实现配置切换的关键。
*   **应用架构**：
    *   `src/index.ts`：应用主入口，使用 `yargs` 解析命令行参数，根据参数决定启动哪种协议桥接网关。
    *   `src/gateways/`：包含了所有协议转换的逻辑实现，模块化清晰。
    *   `src/lib/mcpServerManager.ts`：项目的核心大脑。它维护一个后端 MCP 服务列表，每个服务都是一个 `ManagedServer` 实例。它负责统一处理来自客户端的 `initialize`、`tools/list` 等请求，并将具体的工具调用分发给相应的后端服务。
    *   `src/lib/config.ts`：定义了配置文件的 Zod Schema，并提供加载和验证配置的函数。

### 主要文件概览

| 文件路径                               | 描述                                                               |
| -------------------------------------- | ------------------------------------------------------------------ |
| `README.md`                            | 项目的整体介绍、功能和使用方法。                                   |
| `Dockerfile`                           | 定义了如何构建应用的 Docker 镜像，采用多阶段构建优化。             |
| `docker-compose.yml`                   | Docker Compose 配置文件，用于定义服务、端口、卷和环境。            |
| `manage-config.sh`                     | **核心管理脚本**，用于查看、切换、创建、编辑和重载服务配置。       |
| `entrypoint.sh`                        | Docker 容器的入口脚本，负责根据环境变量选择并加载配置文件。        |
| `configs/`                             | 存放多个预设的 MCP 配置文件（如 `default.json`, `filesystem-only.json`）。 |
| `mcpconfig-example.json`               | 默认的 MCP 配置文件，包含了文件系统和 GitHub 两个后端服务。          |
| `src/index.ts`                         | 应用的**主入口**，解析命令行参数并启动相应的网关服务。             |
| `src/lib/mcpServerManager.ts`          | **核心逻辑**，负责管理和代理多个后端 MCP 服务。                    |
| `src/gateways/`                        | 包含所有协议转换逻辑的目录，如 `configToSse.ts`, `stdioToWs.ts` 等。 |
| `CONFIG-MANAGEMENT.md` & `DOCKER.md`   | 详细的配置管理和 Docker 使用文档。                                 |
| `package.json`                         | 定义了项目依赖、脚本和元数据。                                     |