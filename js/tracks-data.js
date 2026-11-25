/* Extra learning tracks shown on the hub next to the AI roadmap.
   Item ids are stable — progress is stored against them, so never renumber. */
window.TRACKS = [
  {
    id: "dsa", name: "DSA", xp: 20, accent: "green",
    tagline: "50 fundamentals — numbers, strings, arrays",
    itemWord: "question", codeNotes: true,
    groups: [
      { name: "Numbers", items: [
        "Reverse a String", "Check if a String is a Palindrome", "Check if a Number is a Palindrome", "Reverse an Integer",
        "Check if a Number is Prime", "Print Prime Numbers in a Range", "Find Factorial of a Number", "Generate Fibonacci Series",
        "Find the Nth Fibonacci Number", "Check if a Number is Armstrong", "Check if a Number is Perfect", "Find GCD of Two Numbers",
        "Find LCM of Two Numbers", "Count Digits in a Number", "Find Sum of Digits of a Number"
      ]},
      { name: "Strings", items: [
        "Reverse Words in a String", "Count Vowels and Consonants", "Count Frequency of Characters", "Find Duplicate Characters in a String",
        "Remove Duplicate Characters from a String", "Check if Two Strings are Anagrams", "Find the First Non-Repeating Character"
      ]},
      { name: "Arrays", items: [
        "Find the Largest Element in an Array", "Find the Smallest Element in an Array", "Find the Second Largest Element in an Array",
        "Find the Second Smallest Element in an Array", "Find the Sum of Array Elements", "Reverse an Array", "Check if an Array is Sorted",
        "Remove Duplicates from an Array", "Find Duplicate Elements in an Array", "Find Missing Number in an Array",
        "Find Frequency of Array Elements", "Find Common Elements in Two Arrays", "Merge Two Sorted Arrays",
        "Find Intersection of Two Arrays", "Find Union of Two Arrays", "Move All Zeros to the End",
        "Find Maximum and Minimum Difference", "Find Pair with Given Sum"
      ]},
      { name: "Additional Fundamentals", items: [
        "Find the Largest and Smallest Element in an Array", "Find the Average of Elements in an Array",
        "Rotate an Array to the Left by One Position", "Rotate an Array to the Right by One Position",
        "Find the Sum of Even and Odd Numbers in an Array", "Count Even and Odd Numbers in an Array",
        "Find the Longest Word in a String", "Check if a String Contains Only Digits",
        "Find the Character with Maximum Frequency in a String", "Find the Common Characters Between Two Strings"
      ]}
    ],
    tips: ["Write the brute force first, then improve it.", "Say the time and space complexity out loud before you code.", "Test edge cases: empty input, one element, negatives, duplicates."]
  },

  {
    id: "sd", name: "System Design", xp: 50, accent: "blue",
    tagline: "Arpit Bhayani — System Design for Beginners & Masterclass",
    itemWord: "video",
    groups: [
      { name: "Foundations", items: ["Course Introduction", "What is System Design", "How to approach system design", "How do you evaluate that you have built a good system"] },
      { name: "Databases", items: ["Relational Databases", "Database Isolation Levels", "Scaling Databases", "Sharding and Partitioning", "Non-Relational Databases", "Picking the right database"] },
      { name: "Caching", items: ["What is caching", "Populating and scaling a cache", "Caching at different levels"] },
      { name: "Messaging & async", items: ["Message Brokers and Queues", "Message Stream and Kafka Essentials", "Realtime Pub/Sub"] },
      { name: "Scale & reliability", items: ["Load Balancers", "Circuit Breakers", "Data Redundancy & Recovery", "Leader Election for auto-recovery"] },
      { name: "Building blocks", items: ["Client-server model & Communication protocols", "Blob Storage & S3", "Bloom Filters", "Consistent Hashing", "Introduction to Big Data Tools"] },
      { name: "Case studies", items: [
        "Design E-commerce Product Listing", "Designing an API Rate Limiter", "Designing & Scaling Notifications", "Designing a Realtime Abuse Masker",
        "Designing Tinder Feed", "Designing Twitter Trends", "Designing a URL Shortener", "Designing GitHub Gists and Pastebin",
        "Designing a Fraud Detection System", "Designing a Recommendation Engine", "Designing a Web Crawler"
      ]}
    ],
    tips: ["After each video, write the 3 trade-offs it was really about.", "For case studies: pause after the requirements and sketch your own design first, then compare."]
  },

  {
    id: "fs", name: "Full-stack", xp: 60, accent: "amber",
    tagline: "Frontend · Backend · Database · DevOps — topics to revise",
    itemWord: "topic",
    groups: [
      { name: "Frontend", items: [
        { t: "React Server Components", sub: [
          "Server vs Client components, and the \"use client\" boundary",
          "Data fetching in async server components",
          "Streaming with Suspense and loading states",
          "Server Actions and mutations",
          "Caching and revalidation in the Next.js App Router",
          "What can't cross the boundary: serialization, functions, context"
        ]},
        { t: "React performance optimization", sub: [
          "Rendering model: what actually triggers a re-render",
          "memo / useMemo / useCallback: when they help and when they hurt",
          "React Profiler and finding wasted renders",
          "Code splitting with lazy() and dynamic import",
          "List virtualization for long lists",
          "Core Web Vitals (LCP, INP, CLS): measuring and fixing",
          "Bundle size, images and fonts"
        ]}
      ]},
      { name: "Backend", items: [
        { t: "Advanced Node.js", sub: [
          "Event loop phases, microtasks vs macrotasks",
          "libuv thread pool, and what blocks it",
          "worker_threads vs child_process",
          "Memory leaks and heap snapshots",
          "Profiling with --inspect and clinic.js",
          "AsyncLocalStorage for request context"
        ]},
        { t: "Streams & streaming", sub: [
          "Readable, Writable, Transform and Duplex streams",
          "Backpressure and stream.pipeline()",
          "Streaming HTTP responses and SSE",
          "Streaming big uploads straight to S3",
          "Async iterators over streams"
        ]},
        { t: "Clustering & scaling Node", sub: [
          "The cluster module and PM2",
          "Sticky sessions (and why WebSockets need them)",
          "Graceful shutdown: draining connections",
          "Horizontal scaling behind a load balancer",
          "Cluster vs one process per container"
        ]},
        { t: "Message queues: RabbitMQ", sub: [
          "Exchanges (direct, topic, fanout), queues and bindings",
          "Acks, prefetch and redelivery",
          "Retries and dead-letter queues",
          "Delivery guarantees: at-most-once vs at-least-once",
          "RabbitMQ vs BullMQ (Redis) for Node apps"
        ]},
        { t: "Kafka", sub: [
          "Topics, partitions and offsets",
          "Producers: keys, acks, idempotence",
          "Consumer groups and rebalancing",
          "Ordering guarantees and exactly-once semantics",
          "Retention and log compaction",
          "When Kafka, when RabbitMQ"
        ]},
        { t: "GraphQL subscriptions, Apollo & Federation", sub: [
          "Schema, resolvers, the N+1 problem and DataLoader",
          "Subscriptions over WebSocket (graphql-ws)",
          "Scaling subscriptions with Redis pub/sub",
          "Apollo Server and the Apollo Client cache",
          "Apollo Federation: subgraphs, entities, @key, the router",
          "Auth, depth limits and query-cost limits"
        ]}
      ]},
      { name: "Database", items: [
        { t: "PostgreSQL optimization", sub: [
          "Reading EXPLAIN ANALYZE plans",
          "pg_stat_statements: finding slow queries",
          "VACUUM, autovacuum and table bloat",
          "Connection pooling with PgBouncer",
          "Keyset vs offset pagination",
          "Config basics: shared_buffers, work_mem, effective_cache_size"
        ]},
        { t: "Database indexing", sub: [
          "B-tree, Hash, GIN, GiST, BRIN: which for what",
          "Composite indexes and column order",
          "Partial and expression indexes",
          "Covering indexes (INCLUDE) and index-only scans",
          "What indexes cost on writes",
          "Finding missing and unused indexes"
        ]},
        { t: "Caching with PostgreSQL", sub: [
          "Shared buffers and the OS page cache",
          "Materialized views and refresh strategies",
          "Redis in front of Postgres: cache-aside and write-through",
          "Invalidation, TTLs and cache stampede",
          "Invalidating from the DB: LISTEN/NOTIFY or CDC"
        ]},
        { t: "Read & write replicas", sub: [
          "Streaming replication with WAL; sync vs async",
          "Routing reads and writes in the app",
          "Replica lag and read-your-own-writes",
          "Failover and promoting a replica",
          "RDS / Aurora read replicas in practice"
        ]},
        { t: "Scaling databases", sub: [
          "Vertical vs horizontal scaling",
          "Postgres partitioning: range, list, hash",
          "Sharding and choosing a shard key (Citus)",
          "Connection limits at scale",
          "CQRS, and moving search/analytics out of the main DB"
        ]}
      ]},
      { name: "DevOps", items: [
        { t: "What is DevOps", sub: [
          "The culture: CI/CD, IaC, monitoring, short feedback loops",
          "The pipeline: build → test → artifact → deploy → observe",
          "DORA metrics",
          "Docker refresher: images, layers, multi-stage builds",
          "GitHub Actions basics"
        ]},
        { t: "Host a T3 app on AWS — the whole path", sub: [
          "Route 53: domain and DNS records",
          "ACM: TLS certificates",
          "CloudFront: CDN in front of everything",
          "S3: static assets and uploads",
          "Application Load Balancer: routing and health checks",
          "EC2 or ECS Fargate: running the Next.js server",
          "RDS Postgres (+ ElastiCache Redis)",
          "Secrets Manager / SSM Parameter Store for env vars",
          "CloudWatch: logs, metrics and alarms",
          "IAM roles, VPC, public/private subnets, security groups, NAT"
        ], done: "You can draw the full request path from the browser to the database and back." },
        { t: "AWS vs GCP — service names", sub: ["Learn the mapping in the table below", "Know which three you'd pick on each cloud for a T3 app"], table: {
          head: ["What", "AWS", "GCP"],
          rows: [
            ["Virtual machines", "EC2", "Compute Engine"],
            ["Containers (managed)", "ECS / Fargate", "Cloud Run"],
            ["Kubernetes", "EKS", "GKE"],
            ["Serverless functions", "Lambda", "Cloud Run functions"],
            ["Object storage", "S3", "Cloud Storage"],
            ["CDN", "CloudFront", "Cloud CDN"],
            ["DNS", "Route 53", "Cloud DNS"],
            ["Load balancer", "ALB / NLB (ELB)", "Cloud Load Balancing"],
            ["Managed SQL", "RDS / Aurora", "Cloud SQL / AlloyDB"],
            ["NoSQL", "DynamoDB", "Firestore / Bigtable"],
            ["Cache", "ElastiCache", "Memorystore"],
            ["Queue", "SQS", "Cloud Tasks / Pub/Sub"],
            ["Pub/sub", "SNS", "Pub/Sub"],
            ["Streaming / Kafka", "Kinesis / MSK", "Pub/Sub / Managed Kafka"],
            ["Data warehouse", "Redshift", "BigQuery"],
            ["Monitoring & logs", "CloudWatch", "Cloud Monitoring / Logging"],
            ["Secrets", "Secrets Manager", "Secret Manager"],
            ["Keys", "KMS", "Cloud KMS"],
            ["Container registry", "ECR", "Artifact Registry"],
            ["CI/CD", "CodePipeline / CodeBuild", "Cloud Build / Cloud Deploy"],
            ["IaC (native)", "CloudFormation", "Infrastructure Manager"],
            ["Identity", "IAM", "IAM"]
          ]
        }},
        { t: "Terraform — infrastructure as code", sub: [
          "Providers, resources and data sources",
          "State, and a remote backend (S3 + locking)",
          "Variables, outputs and modules",
          "The plan → apply workflow",
          "Environments: workspaces vs separate folders",
          "Importing existing infrastructure",
          "Write the T3-on-AWS stack in Terraform"
        ]},
        { t: "Deployment strategies", sub: [
          "Rolling deployments",
          "Blue-green deployments",
          "Canary releases and traffic splitting",
          "Feature flags",
          "Zero-downtime DB migrations (expand → contract)",
          "Rollbacks",
          "On AWS: ALB weighted target groups, ECS, CodeDeploy"
        ]}
      ]},
      { name: "Blog — write about it", items: [
        { t: "Blog: hosting a T3 app on AWS, the whole path", sub: ["Draft", "Architecture diagram", "Publish", "Share on X/LinkedIn"] },
        { t: "Blog: Postgres from slow to fast", sub: ["Draft (indexes, replicas, caching, with numbers)", "Publish", "Share"] },
        { t: "Blog: RabbitMQ vs Kafka for a Node developer", sub: ["Draft", "Publish", "Share"] }
      ]}
    ]
  },

  {
    id: "other", name: "Other", xp: 40, accent: "purple",
    tagline: "Suggested next topics — add your own too",
    itemWord: "topic", allowCustom: true,
    groups: [
      { name: "Suggested", items: [
        { t: "Networking for backend devs", sub: ["DNS resolution end to end", "TCP vs UDP", "The TLS handshake", "HTTP/1.1 vs HTTP/2 vs HTTP/3", "WebSockets and long polling"] },
        { t: "Auth deep-dive", sub: ["Sessions vs JWTs", "OAuth 2.0 and OpenID Connect flows", "Refresh tokens and rotation", "RBAC vs ABAC", "Passkeys / WebAuthn basics"] },
        { t: "Distributed systems essentials", sub: ["CAP and PACELC", "Consistency models", "Idempotency keys", "Distributed locks (and why they're hard)", "Sagas and the outbox pattern"] },
        { t: "Observability", sub: ["Logs vs metrics vs traces", "OpenTelemetry", "Prometheus + Grafana", "SLIs, SLOs and alerting that doesn't page you for nothing"] },
        { t: "Web security", sub: ["OWASP Top 10", "XSS, CSRF, SQL injection", "CORS done right", "Rate limiting and abuse prevention", "Secrets handling"] },
        { t: "CI/CD with GitHub Actions", sub: ["Workflows, jobs and caching", "Matrix builds", "Environments and approvals", "OIDC to AWS (no long-lived keys)"] },
        { t: "Kubernetes basics", sub: ["Pods, Deployments, Services", "Ingress", "ConfigMaps and Secrets", "Autoscaling (HPA)", "When not to use Kubernetes"] },
        { t: "Low-level design", sub: ["SOLID in TypeScript", "Common design patterns", "LLD problems: parking lot, LRU cache, rate limiter class"] },
        { t: "Testing strategy", sub: ["The test pyramid", "Integration tests with Testcontainers", "Contract tests", "Load testing with k6"] },
        { t: "Advanced TypeScript", sub: ["Generics and constraints", "Conditional and mapped types", "infer and template literal types", "Types from Zod schemas"] },
        { t: "DSA — next level (patterns)", sub: ["Two pointers", "Sliding window", "Hashing", "Binary search", "BFS / DFS", "Then NeetCode 150"] },
        { t: "Behavioral interviews", sub: ["5 STAR stories", "Conflict and ownership stories", "A failure story you can tell well", "Why you, why this company"] }
      ]}
    ]
  }
];
