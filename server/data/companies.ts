export interface ILeetCodeProblem {
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  title: string;
  concept: string;
  whyRecommended: string;
  url: string;
  platform: 'LeetCode';
  acceptanceRate?: string;
}

export interface ICompanyAssessmentQuestion {
  id: string;
  dimension: string;
  dimensionLabel: string;
  question: string;
  context: string;
  options: {
    id: string;
    text: string;
    rationale: string;
    score: number; // 1 to 5 scale for this company's hiring rubric
  }[];
}

export interface ICompanyProfile {
  id: string;
  name: string;
  tier: 'FAANG/Tier-1' | 'Enterprise/Service' | 'Product/Scaleup';
  logoBadge?: string;
  interviewStyle: string;
  primaryCodingFocus: string[];
  systemDesignFocus: string[];
  behavioralFocus: string[];
  hiringBarNote: string;
  coreLeetCodeConcept: {
    concept: string;
    explanation: string;
    whyRequired: string;
    problems: ILeetCodeProblem[];
  };
  assessmentQuestions: ICompanyAssessmentQuestion[];
  sampleQuestions: {
    type: 'Coding' | 'System Design' | 'Behavioral' | 'Technical';
    question: string;
  }[];
}

export const POPULAR_COMPANIES: ICompanyProfile[] = [
  {
    id: 'google',
    name: 'Google',
    tier: 'FAANG/Tier-1',
    interviewStyle: 'Rigorous algorithmic problem solving, time/space optimality, graph traversals, and scalable distributed system design with clean testable code.',
    primaryCodingFocus: ['Graphs & Topological Sort', 'Dynamic Programming', 'Tries & Prefix Trees', 'Union-Find', 'Divide and Conquer'],
    systemDesignFocus: ['Scalability across billions of queries', 'Consistent Hashing & Paxos consensus', 'BigTable/Spanner paradigms', 'Global latency optimization'],
    behavioralFocus: ['Googliness', 'Navigating extreme ambiguity', 'Intellectual humility', 'Cross-functional collaborative impact'],
    hiringBarNote: 'High bar on optimal Big-O complexity analysis and zero bug tolerances in edge cases.',
    coreLeetCodeConcept: {
      concept: 'Graph Traversal (BFS/DFS) & Topological Sorting',
      explanation: 'Optimizes dependency graph resolution and acyclic pathways. Essential for distributed scheduling engines and network reachability.',
      whyRequired: 'Google algorithmic rounds explicitly stress graph structures, cycle detection, and sub-second scale traversal over brute force recursion.',
      problems: [
        {
          difficulty: 'Basic',
          title: 'Maximum Depth of Binary Tree',
          concept: 'Tree Traversal (DFS)',
          whyRecommended: 'Foundational tree traversal demonstrating optimal recursive stack depth and edge-case boundary checks demanded by Google screeners.',
          url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
          platform: 'LeetCode',
          acceptanceRate: '75%',
        },
        {
          difficulty: 'Intermediate',
          title: 'Course Schedule (Topological Sort)',
          concept: 'Directed Graphs & Kahn Algorithm',
          whyRecommended: 'One of the most frequently asked Google interview problems; tests cycle detection in directed dependency graphs using in-degrees.',
          url: 'https://leetcode.com/problems/course-schedule/',
          platform: 'LeetCode',
          acceptanceRate: '48%',
        },
        {
          difficulty: 'Advanced',
          title: 'Trapping Rain Water',
          concept: 'Two Pointers & Monotonic Spatial Bound',
          whyRecommended: 'Classic Google onsite problem demanding dual-pointer linear spatial tracking with zero secondary memory allocation.',
          url: 'https://leetcode.com/problems/trapping-rain-water/',
          platform: 'LeetCode',
          acceptanceRate: '62%',
        },
      ],
    },
    assessmentQuestions: [
      {
        id: 'goog-q1',
        dimension: 'algorithmicRigor',
        dimensionLabel: 'Algorithmic Rigor & Big-O Optimization',
        question: 'Your service receives 500,000 lookup requests/second. A brute-force query runs in O(n) time. How do you re-architect it?',
        context: 'Google engineering places immense weight on mathematical space/time bounds and amortized efficiency.',
        options: [
          {
            id: 'a',
            text: 'Replace with an in-memory hash index with consistent hashing for O(1) amortized lookups across shards.',
            rationale: 'Optimal Google pattern: minimizes network hops and achieves horizontal scale.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Add a multi-layer LRU cache and background refresh worker to buffer hot keys.',
            rationale: 'Solid production practice, though requires cache invalidation strategies.',
            score: 4,
          },
          {
            id: 'c',
            text: 'Spin up 20 additional server instances to absorb the concurrent load horizontally.',
            rationale: 'Costly brute-force infrastructure scaling without fixing algorithm bounds.',
            score: 2,
          },
          {
            id: 'd',
            text: 'Batch requests and process them synchronously in an indexed relational database.',
            rationale: 'Will cause severe database connection pool starvation under 500k QPS.',
            score: 1,
          },
        ],
      },
      {
        id: 'goog-q2',
        dimension: 'googlinessAmbiguity',
        dimensionLabel: 'Googliness & Navigating Ambiguity',
        question: 'A Product Manager hands you a one-sentence brief: "Build an automated anomalous latency alert system for global queries."',
        context: 'Google evaluates how well you decompose vague, open-ended problem statements into verifiable milestones.',
        options: [
          {
            id: 'a',
            text: 'Draft a short 1-page Design Doc defining metrics (p95/p99), scope, false-positive thresholds, and consult peer SREs.',
            rationale: 'Exemplary Googliness: structured proactive initiative, metrics definition, and peer consensus.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Build a quick prototype script immediately and ask the PM if the preliminary output matches their vision.',
            rationale: 'Demonstrates agility, but lacks systemic consensus and edge case scoping.',
            score: 3,
          },
          {
            id: 'c',
            text: 'Push back and request that the PM provide a complete specification with detailed formulas before coding.',
            rationale: 'Passively blocks progress when leadership expects engineers to navigate ambiguity.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Pick a static 500ms threshold rule and write a simple cron alert into production logs.',
            rationale: 'Superficial alert design prone to alert fatigue and missing localized spikes.',
            score: 2,
          },
        ],
      },
      {
        id: 'goog-q3',
        dimension: 'distributedSystems',
        dimensionLabel: 'Distributed System Scale',
        question: 'When writing state across multiple geographic regions, how do you handle network partition anomalies (CAP theorem)?',
        context: 'Google pioneered systems like Spanner (TrueTime) and BigTable to handle planetary-scale partitions.',
        options: [
          {
            id: 'a',
            text: 'Analyze the business trade-off: use consensus (Raft/Paxos) for critical balances, and eventual consistency with vector clocks for social feeds.',
            rationale: 'World-class architectural discernment matching data durability to real business risk.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Always enforce strict ACID synchronization with 2-phase commit across all transatlantic data centers.',
            rationale: 'Causes severe latency degradation and availability paralysis during WAN hiccups.',
            score: 2,
          },
          {
            id: 'c',
            text: 'Rely solely on local database transactions and let cron sync discrepancies weekly.',
            rationale: 'High probability of silent data corruption and irreconcilable state drift.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Implement asynchronous message queues with idempotent consumer deduplication and dead-letter queues.',
            rationale: 'Strong enterprise pattern with good balance of reliability and decoupling.',
            score: 4,
          },
        ],
      },
      {
        id: 'goog-q4',
        dimension: 'codeQuality',
        dimensionLabel: 'Code Health & Test Rigor',
        question: 'During a peer code review at Google, you spot a 300-line function with 90% test coverage but tightly coupled database calls.',
        context: 'Google Readability and code health emphasize dependency injection and hermetic testability.',
        options: [
          {
            id: 'a',
            text: 'Politely suggest refactoring into modular pure functions and injecting repository interfaces so unit tests remain hermetic.',
            rationale: 'Constructive, respectful, and elevates long-term maintainability without condescension.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Approve it since 90% test coverage exceeds the repository standard requirement.',
            rationale: 'Coverage percentage alone does not compensate for tightly coupled brittle architecture.',
            score: 2,
          },
          {
            id: 'c',
            text: 'Reject the PR immediately with a comment saying "This violates clean architecture principles."',
            rationale: 'Unhelpful and hostile feedback lacking actionable guidance.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Offer to pair-program for 20 minutes to extract the database calls into a dedicated helper module.',
            rationale: 'Highly collaborative and helpful team-first mentorship.',
            score: 4,
          },
        ],
      },
    ],
    sampleQuestions: [
      { type: 'Coding', question: 'Find the median of two sorted arrays in O(log(min(n, m))) time.' },
      { type: 'System Design', question: 'Design Google Docs collaborative real-time editor or Google Drive file sync.' },
      { type: 'Behavioral', question: 'Tell me about a time you solved a complex engineering ambiguity without clear requirements.' },
    ],
  },
  {
    id: 'meta',
    name: 'Meta',
    tier: 'FAANG/Tier-1',
    interviewStyle: 'Fast-paced algorithmic rounds requiring complete working code in 40 minutes, plus component architecture & feed design.',
    primaryCodingFocus: ['Binary Search', 'Sliding Window', 'Two Pointers', 'Tree Traversals', 'Hash Tables'],
    systemDesignFocus: ['News Feed ranking & fanout', 'Live video broadcasting', 'Distributed caching (Memcached)', 'Real-time WebSockets & GraphQL'],
    behavioralFocus: ['Move fast & be bold', 'Give direct feedback', 'Focus on impact', 'Resilience under high scale'],
    hiringBarNote: 'Tests coding speed, speed of execution, and deep understanding of client-server data flows.',
    coreLeetCodeConcept: {
      concept: 'Two Pointers & Subarray Sliding Window',
      explanation: 'Maintains dynamic window boundaries to process sequential payloads and substring collisions in linear O(n) time.',
      whyRequired: 'Meta algorithmic screening heavily tests fast, bug-free implementation of window and pointer mechanics under tight 40-minute constraints.',
      problems: [
        {
          difficulty: 'Basic',
          title: 'Valid Palindrome',
          concept: 'Two Pointers (Inward Scan)',
          whyRecommended: 'Essential Meta warmup test evaluating clean alphanumeric parsing and inward pointer scanning.',
          url: 'https://leetcode.com/problems/valid-palindrome/',
          platform: 'LeetCode',
          acceptanceRate: '47%',
        },
        {
          difficulty: 'Intermediate',
          title: 'Subarray Sum Equals K',
          concept: 'Prefix Sum & HashMap Lookup',
          whyRecommended: 'Top Meta interview question testing prefix frequency maps to uncover contiguous target sum arrays in O(n) time.',
          url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
          platform: 'LeetCode',
          acceptanceRate: '43%',
        },
        {
          difficulty: 'Advanced',
          title: 'Minimum Window Substring',
          concept: 'Dynamic Sliding Window & Character Counts',
          whyRecommended: 'Classic high-frequency Meta problem requiring dynamic contract-and-expand window pointers over character frequency maps.',
          url: 'https://leetcode.com/problems/minimum-window-substring/',
          platform: 'LeetCode',
          acceptanceRate: '42%',
        },
      ],
    },
    assessmentQuestions: [
      {
        id: 'meta-q1',
        dimension: 'executionSpeed',
        dimensionLabel: 'Move Fast & Execution Velocity',
        question: 'You discover that an experimental feed ranking algorithm increases user engagement by 12% but occasionally shows duplicate cards to 0.4% of users.',
        context: 'Meta culture values calculated boldness and rapid learning cycles while monitoring blast radius.',
        options: [
          {
            id: 'a',
            text: 'Add client-side deduplication as a quick safety patch, roll out behind a 5% feature flag gate, and monitor metrics.',
            rationale: 'Exemplary Meta mindset: moves fast, protects UX with a quick patch, and uses feature flags to measure impact.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Halt the entire experiment for two months to rewrite the server feed generator from scratch.',
            rationale: 'Overly conservative and kills momentum on a statistically verified 12% engagement win.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Ship to 100% of users immediately without fixing the bug since 0.4% is an acceptable tolerance.',
            rationale: 'Reckless; shipping known user bugs to 100% degrades consumer trust.',
            score: 2,
          },
          {
            id: 'd',
            text: 'Deploy an automated A/B test with an instant automated rollback threshold on client crash rates.',
            rationale: 'Strong data-driven approach with safe automated circuit breakers.',
            score: 4,
          },
        ],
      },
      {
        id: 'meta-q2',
        dimension: 'clientServerArch',
        dimensionLabel: 'Client-Server Architecture & GraphQL',
        question: 'A mobile user on a 3G network experiences a 3-second render lag when opening their profile. How do you resolve it?',
        context: 'Meta optimizes client-server payload efficiency using declarative queries (GraphQL/Relay) and deferred fragments.',
        options: [
          {
            id: 'a',
            text: 'Adopt declarative field queries with @defer on heavy tabs, and pre-cache critical header data in local SQLite.',
            rationale: 'Exact Meta architecture: instantaneous above-the-fold render with progressive streaming.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Compress the full JSON payload with GZIP on the existing monolithic REST endpoint.',
            rationale: 'Helpful for bytes transferred, but still blocks initial rendering until full parsing completes.',
            score: 3,
          },
          {
            id: 'c',
            text: 'Tell mobile users to switch to Wi-Fi for heavy profile sections.',
            rationale: 'Unacceptable product attitude; Meta serves billions on emerging market 3G/4G networks.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Split the monolithic endpoint into 5 parallel REST API calls.',
            rationale: 'Introduces HTTP connection contention and radio power drain on mobile antennas.',
            score: 2,
          },
        ],
      },
      {
        id: 'meta-q3',
        dimension: 'feedFanout',
        dimensionLabel: 'Feed Fanout & Real-Time Scale',
        question: 'A creator with 40 million followers posts a video update. How should your system deliver it to their followers’ timelines?',
        context: 'Meta system design interviews probe Push (fanout-on-write) vs Pull (fanout-on-read) hybrid architectures.',
        options: [
          {
            id: 'a',
            text: 'Use a hybrid fanout: fanout-on-write for standard users, but fanout-on-read with distributed Memcached for high-follower celebrities.',
            rationale: 'Canonical Meta system design: prevents write amplification stampedes on celebrity accounts.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Loop through all 40 million follower database records synchronously and insert the post ID into each feed.',
            rationale: 'Causes catastrophic write queue explosion and multi-hour database lock contention.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Broadcast via WebSockets to all 40 million users simultaneously.',
            rationale: 'Overwhelms gateway servers; most users are offline and do not need live socket pushes.',
            score: 2,
          },
          {
            id: 'd',
            text: 'Offload the fanout to asynchronous Celery/Kafka worker pools with backpressure throttling.',
            rationale: 'Good operational approach, though celebrity fanout-on-read is architecturally superior.',
            score: 4,
          },
        ],
      },
      {
        id: 'meta-q4',
        dimension: 'directFeedback',
        dimensionLabel: 'Candid Peer Feedback & Impact',
        question: 'A senior engineer proposes an architecture that you have verified will fail under expected peak holiday traffic. What do you do?',
        context: 'Meta values direct, data-backed feedback regardless of engineering hierarchy.',
        options: [
          {
            id: 'a',
            text: 'Run load simulation tests, gather memory/CPU metrics, and present the concrete bottleneck data directly in a collaborative design meeting.',
            rationale: 'Aligns with Meta culture: respectful, candid, data-driven, and focused on protecting user experience.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Stay quiet because they have higher seniority and will bear responsibility if it crashes.',
            rationale: 'Violates engineering ownership and allows predictable production failures.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Complain privately to their engineering director without talking to them first.',
            rationale: 'Damages psychological safety and avoids mature professional collaboration.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Ask open-ended probing questions in the pull request: "What are the expected memory bounds under 5x holiday traffic?"',
            rationale: 'Helpful coaching approach that prompts the author to reflect on boundaries.',
            score: 4,
          },
        ],
      },
    ],
    sampleQuestions: [
      { type: 'Coding', question: 'Subarray Sum Equals K (Prefix Sums) and Minimum Window Substring.' },
      { type: 'System Design', question: 'Design Instagram Stories delivery or Facebook Messenger chat architecture.' },
      { type: 'Behavioral', question: 'Tell me about your highest impact technical accomplishment and how you measured success.' },
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    tier: 'FAANG/Tier-1',
    interviewStyle: 'Heavy grounding in 16 Leadership Principles (LPs) paired with LeetCode medium/hard algorithms and low-level object-oriented design.',
    primaryCodingFocus: ['Trees & Graphs', 'Priority Queues / Heaps', 'LRU Cache Design', 'Binary Search', 'Sliding Window'],
    systemDesignFocus: ['High-throughput transaction processing', 'Eventual consistency & DynamoDB partition keys', 'AWS serverless & SQS/SNS', 'Graceful failure isolation'],
    behavioralFocus: ['Customer Obsession', 'Ownership', 'Bias for Action', 'Dive Deep', 'Deliver Results', 'Frugality'],
    hiringBarNote: 'Every interview round explicitly evaluates 2 Amazon Leadership Principles using the STAR method.',
    coreLeetCodeConcept: {
      concept: 'Heaps / Priority Queues & Caching Policies (LRU)',
      explanation: 'Optimizes top-k element extractions and eviction mechanics in O(log k) time without sorting entire collections.',
      whyRequired: 'Amazon technical rounds test scalable order-fulfillment prioritization, rate limiting, and cache design reflecting AWS infrastructure.',
      problems: [
        {
          difficulty: 'Basic',
          title: 'Best Time to Buy and Sell Stock',
          concept: 'Single-Pass Greedy Scan',
          whyRecommended: 'Essential Amazon assessment problem testing optimal single-pass linear time and constant space margins.',
          url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
          platform: 'LeetCode',
          acceptanceRate: '54%',
        },
        {
          difficulty: 'Intermediate',
          title: 'LRU Cache',
          concept: 'Doubly Linked List & HashMap',
          whyRecommended: 'Top Amazon interview staple; tests simultaneous O(1) read access and O(1) recency evictions replicating DynamoDB caches.',
          url: 'https://leetcode.com/problems/lru-cache/',
          platform: 'LeetCode',
          acceptanceRate: '42%',
        },
        {
          difficulty: 'Advanced',
          title: 'Merge k Sorted Lists',
          concept: 'Min-Heap Priority Queue',
          whyRecommended: 'Classic Amazon warehouse/logistics order merge question testing efficient min-heap logarithmic extraction over multiple streaming sources.',
          url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
          platform: 'LeetCode',
          acceptanceRate: '51%',
        },
      ],
    },
    assessmentQuestions: [
      {
        id: 'amzn-q1',
        dimension: 'customerObsession',
        dimensionLabel: 'Customer Obsession (LP #1)',
        question: 'Your team is deciding between building an exciting new AI recommendation engine or fixing an intermittent 400ms checkout latency spike.',
        context: 'Amazon leaders start with the customer and work backwards, prioritizing customer trust above internal novelties.',
        options: [
          {
            id: 'a',
            text: 'Fix the checkout latency spike immediately: every 100ms delay directly degrades checkout completion and customer trust.',
            rationale: 'Pure Amazon Customer Obsession: defends core user utility and conversion over engineering vanity.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Build the AI recommendation engine first because it sounds better on annual performance reviews.',
            rationale: 'Self-serving and violates Amazon culture of working backwards from customer needs.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Ignore the latency spike until customers submit at least 50 support tickets complaining about it.',
            rationale: 'Reactive and negligent; customer trust is lost long before angry tickets are filed.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Split the team to address the critical path of the latency bug while running a small POC for the AI engine.',
            rationale: 'Pragmatic, though complete resolution of customer friction should remain priority #1.',
            score: 4,
          },
        ],
      },
      {
        id: 'amzn-q2',
        dimension: 'biasForAction',
        dimensionLabel: 'Bias for Action & Two-Way Doors',
        question: 'You must choose a database indexing strategy for an internal tools dashboard. Complete traffic benchmarks will take 3 weeks to gather.',
        context: 'Speed matters in business. Many decisions are reversible ("two-way doors") and do not need exhaustive study.',
        options: [
          {
            id: 'a',
            text: 'Recognize this is a two-way door decision: add a composite index now, verify in staging, and modify easily if query plans require it.',
            rationale: 'Exemplary Bias for Action: calculates risk, ships fast, and avoids unnecessary paralysis.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Wait the full 3 weeks for perfect data before adding a single index.',
            rationale: 'Unnecessary delay on a low-risk, reversible configuration change.',
            score: 2,
          },
          {
            id: 'c',
            text: 'Ask the vice president of engineering to make the decision for you.',
            rationale: 'Lacks ownership and escalates routine engineering tasks.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Deploy an automated migration script with rollback hooks and monitor slow query logs in canary.',
            rationale: 'Strong operational safety paired with prompt execution.',
            score: 4,
          },
        ],
      },
      {
        id: 'amzn-q3',
        dimension: 'diveDeep',
        dimensionLabel: 'Dive Deep (LP #8)',
        question: 'An automated alert fires indicating that 0.05% of order confirmation emails are delayed by 10 minutes. The on-call manager suggests ignoring it.',
        context: 'Amazon leaders operate at all levels, stay connected to details, and audit discrepancies relentlessly.',
        options: [
          {
            id: 'a',
            text: 'Dive deep into SQS dead-letter queues and CloudWatch trace IDs to isolate whether a specific payment provider is timing out.',
            rationale: 'Signature Amazon Dive Deep: relentlessly audits root causes rather than dismissing small percentage anomalies.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Acknowledge the alert, silence it for 24 hours, and hope it clears up on its own.',
            rationale: 'Violates Amazon Operational Excellence and risks widespread cascade failures.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Restart all worker containers blindly without looking at log traces.',
            rationale: 'Destroys transient diagnostic state without resolving the underlying cause.',
            score: 2,
          },
          {
            id: 'd',
            text: 'Create a ticket in the backlog for the next sprint to analyze the retry queue.',
            rationale: 'Delays investigation of an active production defect.',
            score: 2,
          },
        ],
      },
      {
        id: 'amzn-q4',
        dimension: 'ownership',
        dimensionLabel: 'Ownership & Long-Term Value',
        question: 'You notice that a legacy microservice owned by another team has an unpatched security vulnerability and no active maintainer.',
        context: 'Amazon leaders are owners. They think long term and never say "that’s not my job."',
        options: [
          {
            id: 'a',
            text: 'Open an urgent security ticket, draft the dependency patch yourself or coordinate with the on-call team to deploy it.',
            rationale: 'True ownership: takes personal responsibility for protecting the company and customer.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Ignore it because it is not owned by your immediate team.',
            rationale: 'Directly violates the core principle: "Never say that’s not my job."',
            score: 1,
          },
          {
            id: 'c',
            text: 'Post an anonymous message on internal Slack making fun of the legacy code.',
            rationale: 'Toxic behavior that degrades team trust and solves nothing.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Document the vulnerability in the internal wiki and email the original author.',
            rationale: 'Responsible documentation, though requires proactive remediation tracking.',
            score: 3,
          },
        ],
      },
    ],
    sampleQuestions: [
      { type: 'Coding', question: 'Course Schedule (Topological Sort) and Word Ladder (BFS shortest path).' },
      { type: 'System Design', question: 'Design Amazon locker delivery network or prime video streaming platform.' },
      { type: 'Behavioral', question: 'Give an example of when you had to make a high-stakes technical decision with incomplete data (Bias for Action).' },
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    tier: 'FAANG/Tier-1',
    interviewStyle: 'Clean object-oriented architecture, data structures, concurrency, customer empathy, and modular system design.',
    primaryCodingFocus: ['Binary Search Trees', 'Linked Lists', 'Arrays & HashMaps', 'Two Pointers', 'Recursion & Dynamic Programming'],
    systemDesignFocus: ['Azure cloud services', 'Enterprise reliability & backwards compatibility', 'Microservices resilience', 'Database indexing & transactions'],
    behavioralFocus: ['Growth Mindset', 'Customer obsession', 'Diversity & Inclusion', 'Learning from technical failures'],
    hiringBarNote: 'Emphasizes readable, maintainable, extensible code and proactive error handling.',
    coreLeetCodeConcept: {
      concept: 'Binary Trees & Linked Lists (Clean Pointer Manipulation)',
      explanation: 'Navigates pointer structures with strict boundary verification, defensive null validation, and recursion unwinding.',
      whyRequired: 'Microsoft interviews evaluate production readability, SOLID design, and thorough edge-case handling over cryptic one-liners.',
      problems: [
        {
          difficulty: 'Basic',
          title: 'Reverse Linked List',
          concept: 'In-Place Pointer Reversal',
          whyRecommended: 'Foundational Microsoft screening question evaluating clean pointer manipulation and edge case null checks.',
          url: 'https://leetcode.com/problems/reverse-linked-list/',
          platform: 'LeetCode',
          acceptanceRate: '75%',
        },
        {
          difficulty: 'Intermediate',
          title: 'Validate Binary Search Tree',
          concept: 'Recursive Inorder & Subtree Bounds',
          whyRecommended: 'Top Microsoft technical assessment question checking strict BST lower/upper bound invariants across recursive calls.',
          url: 'https://leetcode.com/problems/validate-binary-search-tree/',
          platform: 'LeetCode',
          acceptanceRate: '33%',
        },
        {
          difficulty: 'Advanced',
          title: 'Median of Two Sorted Arrays',
          concept: 'Binary Search Over Array Partitions',
          whyRecommended: 'Classic Microsoft onsite algorithmic benchmark demanding O(log(min(m,n))) logarithmic array partitioning.',
          url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
          platform: 'LeetCode',
          acceptanceRate: '40%',
        },
      ],
    },
    assessmentQuestions: [
      {
        id: 'msft-q1',
        dimension: 'growthMindset',
        dimensionLabel: 'Growth Mindset & Learning from Failure',
        question: 'A framework you spent three weeks advocating for fails severely under staging load. How do you respond in the post-mortem?',
        context: 'Microsoft culture transformed under Satya Nadella to prioritize a "learn-it-all" growth mindset over a "know-it-all" defense.',
        options: [
          {
            id: 'a',
            text: 'Conduct a blameless post-mortem analyzing the precise failure mechanisms, share learnings across the team, and evaluate better alternatives.',
            rationale: 'Exemplary Microsoft Growth Mindset: turns unexpected outcomes into high-value organizational learning.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Blame the cloud provider’s virtual machines rather than examining the framework’s limitations.',
            rationale: 'Defensive and obscures critical performance bottlenecks.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Hide the staging benchmark results and quietly deploy to production anyway.',
            rationale: 'Catastrophic negligence that threatens enterprise reliability.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Quickly revert to the previous codebase and document the memory limits observed.',
            rationale: 'Safe engineering recovery, though sharing transparent learnings elevates the whole organization.',
            score: 4,
          },
        ],
      },
      {
        id: 'msft-q2',
        dimension: 'backwardsCompatibility',
        dimensionLabel: 'Backwards Compatibility & Enterprise Trust',
        question: 'You need to refactor a core API endpoint used by hundreds of enterprise customers. How do you roll it out?',
        context: 'Microsoft software powers global enterprises; breaking an established contract breaks customer businesses.',
        options: [
          {
            id: 'a',
            text: 'Introduce a new versioned endpoint (/v2), support legacy /v1 concurrently with deprecation notices, and provide a migration SDK.',
            rationale: 'Hallmark of Microsoft enterprise engineering: zero disruption for existing customer mission-critical workloads.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Deploy breaking changes on a Friday night without notifying clients.',
            rationale: 'Destroys enterprise trust and causes catastrophic client outage incidents.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Delete the old parameters immediately and return HTTP 400 with a link to the new documentation.',
            rationale: 'Unacceptable enterprise practice that abruptly breaks existing customer systems.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Add optional parameters to the existing endpoint while maintaining complete backward compatibility for old payloads.',
            rationale: 'Very solid and non-breaking approach when schema flexibility allows it.',
            score: 4,
          },
        ],
      },
      {
        id: 'msft-q3',
        dimension: 'codeClarity',
        dimensionLabel: 'Modular Design & Code Readability',
        question: 'How do you approach writing software that will be maintained by engineers across multiple time zones for the next 7 years?',
        context: 'Microsoft emphasizes readable, clean, self-documenting code with clear interfaces over clever hacks.',
        options: [
          {
            id: 'a',
            text: 'Write clean SOLID code, document assumptions and boundary invariants, provide end-to-end integration tests, and avoid undocumented magic numbers.',
            rationale: 'Gold standard for long-lived enterprise software maintainability.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Compress all logic into concise one-line ternary expressions to minimize file line counts.',
            rationale: 'Clever syntax hurts readability and creates severe debugging friction for teammates.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Avoid writing tests because the specifications might change in a few years.',
            rationale: 'Leaves future maintainers with zero safety nets during upgrades.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Use clear typed interfaces and autogenerate OpenAPI documentation from schema definitions.',
            rationale: 'Strong modern engineering practice ensuring cross-team alignment.',
            score: 4,
          },
        ],
      },
      {
        id: 'msft-q4',
        dimension: 'crossCollab',
        dimensionLabel: 'Inclusive Collaboration & Alignment',
        question: 'Two partner teams disagree on whether to use gRPC or REST for a high-priority cross-departmental integration.',
        context: 'Microsoft evaluates your ability to bridge divergent views and forge collaborative technical consensus.',
        options: [
          {
            id: 'a',
            text: 'Schedule an alignment sync, evaluate latency vs developer ergonomic trade-offs against shared SLA goals, and document the agreed rationale.',
            rationale: 'Empathetic, collaborative, and establishes shared business objectives.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Build whichever protocol your team prefers and force the other team to adapt to your specification.',
            rationale: 'Siloed and antagonistic; damages cross-team collaboration.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Cancel the integration project entirely due to team friction.',
            rationale: 'Fails to deliver on company priorities.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Build an abstraction layer that allows the backend to support both gRPC and REST simultaneously.',
            rationale: 'Pragmatic technical compromise, though adds secondary maintenance overhead.',
            score: 3,
          },
        ],
      },
    ],
    sampleQuestions: [
      { type: 'Coding', question: 'Implement an LRU Cache with O(1) get and put operations.' },
      { type: 'System Design', question: 'Design Microsoft Teams messaging notification infrastructure.' },
      { type: 'Behavioral', question: 'Describe a project where you adopted a growth mindset to master an unfamiliar technology.' },
    ],
  },
  {
    id: 'apple',
    name: 'Apple',
    tier: 'FAANG/Tier-1',
    interviewStyle: 'Extreme attention to detail, hardware/software interface trade-offs, defensive programming, and user experience excellence.',
    primaryCodingFocus: ['Bit Manipulation', 'Memory Allocation & Pointers', 'Array/String Manipulation', 'Concurrency', 'Data Structures'],
    systemDesignFocus: ['End-to-end data privacy & Secure Enclave', 'Low power & low latency pipelines', 'Local-first offline sync', 'Deterministic resource management'],
    behavioralFocus: ['Attention to detail & craft', 'Collaborative secrecy and ownership', 'Cross-functional craft', 'Product perfectionism'],
    hiringBarNote: 'Deep scrutiny on corner cases, memory efficiency, and why specific data structures were chosen.',
    coreLeetCodeConcept: {
      concept: 'Bit Manipulation & Memory-Efficient Array Transforms',
      explanation: 'Optimizes runtime execution and memory footprint down to the byte/register level without redundant heap allocations.',
      whyRequired: 'Apple interviews scrutinize memory consumption, cache locality, battery impact, and zero-allocation constraints.',
      problems: [
        {
          difficulty: 'Basic',
          title: 'Single Number',
          concept: 'Bitwise XOR Operation',
          whyRecommended: 'Classic Apple technical assessment problem testing O(n) runtime with strictly O(1) constant auxiliary space via bitwise XOR.',
          url: 'https://leetcode.com/problems/single-number/',
          platform: 'LeetCode',
          acceptanceRate: '72%',
        },
        {
          difficulty: 'Intermediate',
          title: 'Product of Array Except Self',
          concept: 'Prefix & Suffix Products (O(1) Space)',
          whyRecommended: 'Top Apple interview question testing division-free prefix accumulation utilizing the output array for zero heap overhead.',
          url: 'https://leetcode.com/problems/product-of-array-except-self/',
          platform: 'LeetCode',
          acceptanceRate: '65%',
        },
        {
          difficulty: 'Advanced',
          title: 'First Missing Positive',
          concept: 'In-Place Index Cycle Sorting (O(1) Space)',
          whyRecommended: 'Rigorous Apple onsite algorithmic benchmark requiring O(n) time and strict O(1) auxiliary memory via in-place index hashing.',
          url: 'https://leetcode.com/problems/first-missing-positive/',
          platform: 'LeetCode',
          acceptanceRate: '38%',
        },
      ],
    },
    assessmentQuestions: [
      {
        id: 'appl-q1',
        dimension: 'attentionToDetail',
        dimensionLabel: 'Obsession with Detail & User Delight',
        question: 'A fluid UI animation drops from 120fps to 90fps on older devices during heavy list scrolling. What is your reaction?',
        context: 'Apple engineering values immaculate polish and user experience fluidity above compromise.',
        options: [
          {
            id: 'a',
            text: 'Profile GPU/CPU draw calls with Instruments, isolate offscreen render passes or layout thrashing, and optimize cell reuse.',
            rationale: 'Exact Apple craftsmanship: profiles down to the hardware frame boundary to guarantee silky smooth rendering.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Leave it alone because 90fps is still reasonably fast for most casual users.',
            rationale: 'Tolerates regression and fails Apple standards for visual perfection.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Remove the animation completely so you do not have to debug it.',
            rationale: 'Sacrifices user delight and craftsmanship out of debugging reluctance.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Disable the animation exclusively on older hardware models while keeping it on flagship devices.',
            rationale: 'Acceptable fallback when hardware bounds strictly require graceful degradation.',
            score: 3,
          },
        ],
      },
      {
        id: 'appl-q2',
        dimension: 'privacyByDesign',
        dimensionLabel: 'User Privacy & Local-First Processing',
        question: 'Product leadership asks if user photo metadata (location, time, faces) can be sent to cloud servers for faster machine learning processing.',
        context: 'Apple treats privacy as a fundamental human right, preferring on-device Neural Engine processing.',
        options: [
          {
            id: 'a',
            text: 'Advocate for on-device CoreML / Neural Engine execution so user photos never leave the secure hardware perimeter.',
            rationale: 'Pure Apple philosophy: protects user sovereignty by keeping sensitive biometric data on device.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Upload everything unencrypted to standard cloud buckets to reduce device battery usage.',
            rationale: 'Catastrophic violation of Apple privacy commitments.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Collect all metadata silently in background analytics events.',
            rationale: 'Deceptive telemetry that violates user trust and Apple policies.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Use differential privacy and homomorphic encryption if cloud aggregation is strictly required for global model updates.',
            rationale: 'Technically advanced privacy-preserving cryptography matching Apple research standards.',
            score: 4,
          },
        ],
      },
      {
        id: 'appl-q3',
        dimension: 'memoryEfficiency',
        dimensionLabel: 'Memory Footprint & Resource Discipline',
        question: 'Your background service leaks 2MB of memory every hour on mobile devices. Over 2 days it triggers an OS low-memory termination.',
        context: 'Apple software runs in resource-constrained environments where leaks degrade device responsiveness.',
        options: [
          {
            id: 'a',
            text: 'Use memory graph debuggers to find retain cycles (strong reference cycles), inspect deallocations, and enforce weak/unowned references.',
            rationale: 'Systematic root-cause resolution ensuring zero memory accumulation over extended device uptimes.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Write a cron script to crash and restart the app process every 12 hours.',
            rationale: 'Appalling hack that degrades battery life and interrupts user foreground state.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Ask the OS team to increase the memory limit for your application.',
            rationale: 'Shifts blame to platform layers instead of cleaning up your code.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Release non-essential cached assets immediately upon receiving OS memory pressure notifications.',
            rationale: 'Essential defensive practice alongside fixing the leak.',
            score: 4,
          },
        ],
      },
      {
        id: 'appl-q4',
        dimension: 'crossFunctionalCraft',
        dimensionLabel: 'Cross-Functional Craft & Discretion',
        question: 'You are working on an unannounced hardware-software feature. A friend from another tech company asks what you are currently building.',
        context: 'Apple maintains strict confidentiality to ensure product announcements deliver maximum consumer surprise and impact.',
        options: [
          {
            id: 'a',
            text: 'Protect confidentiality: warmly steer the conversation to general technology topics without revealing internal project details.',
            rationale: 'Professional, courteous, and upholds Apple commitment to project confidentiality.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Share the architectural diagrams confidentially over private messaging.',
            rationale: 'Severe breach of contract and nondisclosure agreement leading to immediate termination.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Post hints and mockups on anonymous forums.',
            rationale: 'Blatant betrayal of teammates and product launches.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Share only the high-level framework names without mentioning the product name.',
            rationale: 'Still leaks internal roadmaps and engineering priorities.',
            score: 2,
          },
        ],
      },
    ],
    sampleQuestions: [
      { type: 'Coding', question: 'Implement a thread-safe circular buffer or custom memory allocator.' },
      { type: 'System Design', question: 'Design iCloud Photo Backup synchronization with offline conflict resolution.' },
      { type: 'Behavioral', question: 'How do you balance high engineering polish against tight project release deadlines?' },
    ],
  },
  {
    id: 'netflix',
    name: 'Netflix',
    tier: 'FAANG/Tier-1',
    interviewStyle: 'High autonomy, culture of Freedom and Responsibility, high concurrency, stream processing, resilience engineering, and open distributed architecture.',
    primaryCodingFocus: ['Sliding Window', 'Concurrency & Monotonic Deques', 'Graph Connectivity', 'Rate Limiting Algorithms', 'HashMaps'],
    systemDesignFocus: ['Video chunking and CDN delivery', 'Chaos Engineering & fault injection', 'Dynamic adaptive bitrate streaming', 'Microservices telemetry (OpenTelemetry)'],
    behavioralFocus: ['Freedom and Responsibility', 'High talent density', 'Context not control', 'Candor & constructive dissent'],
    hiringBarNote: 'Evaluates senior architectural autonomy, willingness to take bold calculated risks, and deep understanding of distributed resilience.',
    coreLeetCodeConcept: {
      concept: 'Sliding Window & Monotonic Deques (High-Throughput Streaming)',
      explanation: 'Maintains running statistical aggregates across high-volume event streams in amortized O(1) time per element.',
      whyRequired: 'Netflix engineering processes petabytes of video chunks, real-time client telemetry, and rate-limited API gateway packets.',
      problems: [
        {
          difficulty: 'Basic',
          title: 'Contains Duplicate',
          concept: 'HashSet Frequency Lookup',
          whyRecommended: 'Foundational baseline verifying O(n) hash verification for stream packet deduplication.',
          url: 'https://leetcode.com/problems/contains-duplicate/',
          platform: 'LeetCode',
          acceptanceRate: '62%',
        },
        {
          difficulty: 'Intermediate',
          title: 'Sliding Window Maximum',
          concept: 'Monotonic Double-Ended Queue (Deque)',
          whyRecommended: 'Signature Netflix algorithmic question; processes continuous telemetry buffers in amortized O(n) total time.',
          url: 'https://leetcode.com/problems/sliding-window-maximum/',
          platform: 'LeetCode',
          acceptanceRate: '46%',
        },
        {
          difficulty: 'Advanced',
          title: 'Critical Connections in a Network',
          concept: 'Bridges in Graph & Tarjan Algorithm',
          whyRecommended: 'High-frequency Netflix infrastructure problem; identifies single points of failure in microservice dependency graphs.',
          url: 'https://leetcode.com/problems/critical-connections-in-a-network/',
          platform: 'LeetCode',
          acceptanceRate: '56%',
        },
      ],
    },
    assessmentQuestions: [
      {
        id: 'nflx-q1',
        dimension: 'freedomResponsibility',
        dimensionLabel: 'Freedom and Responsibility & Context Not Control',
        question: 'Your microservice needs to adopt an asynchronous message broker. Company policy has no approved list. What do you do?',
        context: 'Netflix provides high autonomy ("Context, not control"); engineers make bold decisions and own the operational outcome.',
        options: [
          {
            id: 'a',
            text: 'Benchmark candidate tools against workload requirements, gather context from peer teams, make a decisive choice, and own its reliability.',
            rationale: 'Exemplary Netflix Freedom & Responsibility: acts autonomously with high context, diligence, and accountability.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Wait for executive management to form a 6-month committee and publish an edict.',
            rationale: 'Paralyzes innovation and demonstrates lack of senior engineering ownership.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Pick a random tool without benchmarking and blame the team if it fails in production.',
            rationale: 'Abuses freedom without taking professional responsibility.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Write a transparent RFC document, gather 48 hours of peer feedback, and proceed with the best option.',
            rationale: 'Excellent collaborative autonomy ensuring peer visibility without bureaucracy.',
            score: 4,
          },
        ],
      },
      {
        id: 'nflx-q2',
        dimension: 'chaosEngineering',
        dimensionLabel: 'Chaos Engineering & Resilience',
        question: 'How do you verify that your microservice will withstand a sudden AWS region-level outage during the premiere of a major series?',
        context: 'Netflix invented Chaos Monkey to continuously inject realistic failures into production systems.',
        options: [
          {
            id: 'a',
            text: 'Run automated chaos drills (kill nodes, inject 500ms network latency), verify circuit breakers trip, and test fallback cached responses.',
            rationale: 'Core Netflix engineering philosophy: proactively prove resilience under real-world catastrophic failure modes.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Assume AWS never experiences regional outages so no drills are needed.',
            rationale: 'Disregards distributed systems reality; AWS regions experience outages every year.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Disable all logging and error monitoring to keep the CPU cool during the premiere.',
            rationale: 'Blinds operators during the most critical traffic window.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Configure multi-region active-active deployment with automated DNS failover routing.',
            rationale: 'Essential infrastructure foundation for region-level fault tolerance.',
            score: 4,
          },
        ],
      },
      {
        id: 'nflx-q3',
        dimension: 'talentDensity',
        dimensionLabel: 'High Talent Density & Direct Candor',
        question: 'In a team sync, a colleague presents an architectural design that you know has a critical single point of failure.',
        context: 'Netflix expects direct, respectful candor. Letting colleagues proceed with fatal flaws is considered disloyal.',
        options: [
          {
            id: 'a',
            text: 'Directly and constructively explain the failure scenario in the meeting, pointing out the exact bottleneck and proposing a mitigation.',
            rationale: 'Demonstrates high candor, protects the service, and treats peers with respect.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Keep quiet to be "nice" and let the service crash in production.',
            rationale: 'Passive and harmful; Netflix defines false politeness as a failure of courage.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Mock their architecture in a public Slack channel.',
            rationale: 'Disrespectful and toxic behavior that damages psychological safety.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Pull them aside immediately after the meeting to discuss your technical concerns one-on-one.',
            rationale: 'Thoughtful alternative if you feel one-on-one will lead to faster resolution.',
            score: 4,
          },
        ],
      },
      {
        id: 'nflx-q4',
        dimension: 'telemetryObs',
        dimensionLabel: 'Telemetry, Latency Percentiles & p99.9',
        question: 'Your average API response time is 15ms, but p99.9 latency spikes to 2,400ms. Is this an issue for Netflix video playback?',
        context: 'At hundreds of millions of streams, 0.1% represents hundreds of thousands of users experiencing video buffering.',
        options: [
          {
            id: 'a',
            text: 'Yes: at Netflix scale, p99.9 represents thousands of buffering users; profile GC pauses, thread pool starvation, and database lock contention.',
            rationale: 'Mastery of distributed scale: understands that tail latency is what ruins real user experience.',
            score: 5,
          },
          {
            id: 'b',
            text: 'No: average 15ms is fantastic, so 0.1% can be completely disregarded.',
            rationale: 'Amateur metric interpretation that hides catastrophic tail latency.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Change your monitoring dashboard to only report the median (p50) so the spike disappears.',
            rationale: 'Dishonest telemetry manipulation that masks active customer pain.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Implement hedged requests (duplicate requests sent after a 20ms delay) to bypass slow outlier nodes.',
            rationale: 'Sophisticated tail-latency mitigation technique pioneered by Google and Netflix.',
            score: 4,
          },
        ],
      },
    ],
    sampleQuestions: [
      { type: 'Coding', question: 'Implement Sliding Window Maximum or design an in-memory LFU cache.' },
      { type: 'System Design', question: 'Design Netflix video encoding and global CDN edge routing architecture.' },
      { type: 'Behavioral', question: 'Give an example of a bold technical decision you made without supervisory approval and the outcome.' },
    ],
  },
  {
    id: 'infosys',
    name: 'Infosys',
    tier: 'Enterprise/Service',
    interviewStyle: 'Strong focus on core Computer Science fundamentals (OOP, DBMS, SQL, Operating Systems), programming syntax, and analytical aptitude.',
    primaryCodingFocus: ['Arrays & Strings', 'SQL Joins & Aggregations', 'OOP Principles (Inheritance, Polymorphism)', 'Searching & Sorting Algorithms'],
    systemDesignFocus: ['Client-Server architecture', 'Relational database schema normalization (3NF)', 'REST API fundamentals', 'Tiered enterprise architecture'],
    behavioralFocus: ['Adaptability to new tech stacks', 'Willingness to learn', 'Team collaboration', 'Clear communication'],
    hiringBarNote: 'Evaluates solid CS basics, problem-solving mindset, and clean coding conventions.',
    coreLeetCodeConcept: {
      concept: 'Array Manipulation & Two Pointers (CS Fundamentals)',
      explanation: 'Manipulates contiguous memory blocks, partitions data, and enforces linear scans with clean syntactic structure.',
      whyRequired: 'Infosys assessments evaluate robust CS core concepts, clean syntax, and fundamental data structures without external libraries.',
      problems: [
        {
          difficulty: 'Basic',
          title: 'Two Sum',
          concept: 'Array & Hash Table Lookup',
          whyRecommended: 'Essential fundamental question testing index lookups and linear space-time trade-offs.',
          url: 'https://leetcode.com/problems/two-sum/',
          platform: 'LeetCode',
          acceptanceRate: '52%',
        },
        {
          difficulty: 'Intermediate',
          title: 'Longest Substring Without Repeating Characters',
          concept: 'Sliding Window & Unique Character Tracking',
          whyRecommended: 'Standard enterprise interview benchmark testing string traversal and window state tracking.',
          url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
          platform: 'LeetCode',
          acceptanceRate: '35%',
        },
        {
          difficulty: 'Advanced',
          title: 'Merge Intervals',
          concept: 'Interval Sorting & Array Merging',
          whyRecommended: 'Classic scheduling challenge testing array sorting and continuous boundary merging.',
          url: 'https://leetcode.com/problems/merge-intervals/',
          platform: 'LeetCode',
          acceptanceRate: '47%',
        },
      ],
    },
    assessmentQuestions: [
      {
        id: 'infy-q1',
        dimension: 'csFundamentals',
        dimensionLabel: 'CS Fundamentals & Database Normalization',
        question: 'You are designing an Employee Project database. A single table stores employee name, department, project name, and client address together.',
        context: 'Infosys heavily tests DBMS normalization (1NF, 2NF, 3NF) and foreign key relationships.',
        options: [
          {
            id: 'a',
            text: 'Normalize into separate Employees, Departments, Projects, and Clients tables linked via foreign keys to eliminate data redundancy and update anomalies.',
            rationale: 'Demonstrates solid relational database design adhering to 3rd Normal Form.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Leave everything in one big table because querying one table requires fewer JOIN statements.',
            rationale: 'Causes severe data redundancy, insert anomalies, and update inconsistency.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Store the whole record as an unindexed string in a text file.',
            rationale: 'Completely unscalable and lacks basic queryability.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Split into Employees and Projects tables, using a join table for many-to-many assignments.',
            rationale: 'Strong practical relational design for many-to-many mapping.',
            score: 4,
          },
        ],
      },
      {
        id: 'infy-q2',
        dimension: 'adaptability',
        dimensionLabel: 'Adaptability Across Tech Stacks',
        question: 'Your client project shifts from Java Spring Boot to Python and PostgreSQL. You have primarily worked with Java in college.',
        context: 'Service firm engineering values agility and rapid upskilling on client demand.',
        options: [
          {
            id: 'a',
            text: 'Embrace the opportunity: study Python syntax, map OOP principles from Java to Python, build a sample CRUD app, and contribute actively.',
            rationale: 'Exemplary adaptability: shows curiosity, resilience, and fast learning curve.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Refuse to work on the project and demand a transfer to a Java-only team.',
            rationale: 'Inflexible and limits professional career growth.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Pretend you already know Python and copy-paste code without understanding it.',
            rationale: 'Introduces undetected bugs and compromises code quality.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Pair with a senior Python engineer on the team and complete official documentation tutorials.',
            rationale: 'Very solid proactive learning strategy.',
            score: 4,
          },
        ],
      },
      {
        id: 'infy-q3',
        dimension: 'oopPrinciples',
        dimensionLabel: 'Clean OOP Design & Maintainability',
        question: 'When designing a billing calculator with multiple tax rules (VAT, GST, State Tax), which design pattern is most appropriate?',
        context: 'Infosys evaluates practical application of OOP design patterns (Strategy, Factory, Singleton).',
        options: [
          {
            id: 'a',
            text: 'Strategy Pattern: encapsulate each tax algorithm in its own class implementing a TaxStrategy interface, making rules swappable without modifying the billing engine.',
            rationale: 'Exact SOLID Open-Closed Principle: extensible for new tax laws without touching core code.',
            score: 5,
          },
          {
            id: 'b',
            text: 'A 500-line if-else chain checking hardcoded string values inside a single method.',
            rationale: 'Brittle, difficult to test, and violates the Open-Closed Principle.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Global variables holding current tax rates that can be changed by any file at runtime.',
            rationale: 'Dangerously prone to race conditions and unpredictable side effects.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Factory Pattern to instantiate the proper calculator based on the customer country code.',
            rationale: 'Good complementary pattern for object instantiation.',
            score: 4,
          },
        ],
      },
      {
        id: 'infy-q4',
        dimension: 'clientCommunication',
        dimensionLabel: 'Client Delivery & Clear Communication',
        question: 'During a client sprint demo, an unexpected edge case fails on the screen. How do you communicate?',
        context: 'Clear professional ownership and consultative composure are core service competencies.',
        options: [
          {
            id: 'a',
            text: 'Acknowledge the issue calmly, clearly explain what unexpected parameter triggered it, commit to a verified patch within 24 hours, and document the test case.',
            rationale: 'Builds client trust through transparency, composure, and concrete follow-through.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Blame the client for entering the wrong test input during the demo.',
            rationale: 'Antagonistic, unprofessional, and severely damages client relationship.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Abruptly disconnect from the video call and pretend your Wi-Fi dropped.',
            rationale: 'Unacceptable lack of professional integrity.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Quickly open the code editor on screen and attempt to patch it live while the client waits.',
            rationale: 'Risky and creates an unstructured panic impression.',
            score: 2,
          },
        ],
      },
    ],
    sampleQuestions: [
      { type: 'Coding', question: 'Write a program to reverse words in a string and find duplicate elements in an array.' },
      { type: 'Technical', question: 'Explain the difference between Overloading and Overriding in OOP with code examples.' },
      { type: 'Technical', question: 'Write a SQL query to find the second highest salary from an Employee table.' },
    ],
  },
  {
    id: 'tcs',
    name: 'TCS',
    tier: 'Enterprise/Service',
    interviewStyle: 'CS engineering foundations, object-oriented concepts, relational databases, data structures, and project walkthroughs.',
    primaryCodingFocus: ['String manipulation', 'Array algorithms', 'OOP implementations', 'SQL aggregations & subqueries'],
    systemDesignFocus: ['Web application architecture', 'Database connections & transactions (ACID)', 'MVC pattern', 'Security basics'],
    behavioralFocus: ['Flexibility across domains', 'Work ethic', 'Client delivery focus', 'Continuous upskilling'],
    hiringBarNote: 'Expects detailed explanations of academic or resume projects and fundamental concepts.',
    coreLeetCodeConcept: {
      concept: 'String & Array Manipulation (Foundational Logic)',
      explanation: 'Handles text parsing, palindrome checks, frequency counts, and boundary iterations with clean code.',
      whyRequired: 'TCS technical evaluations assess fundamental logic construction, control flows, and clean problem resolution.',
      problems: [
        {
          difficulty: 'Basic',
          title: 'Valid Anagram',
          concept: 'Character Frequency Counting',
          whyRecommended: 'Core TCS assessment problem evaluating hash frequency or character array count arrays in O(n) time.',
          url: 'https://leetcode.com/problems/valid-anagram/',
          platform: 'LeetCode',
          acceptanceRate: '64%',
        },
        {
          difficulty: 'Intermediate',
          title: 'Group Anagrams',
          concept: 'Sorted String Keys & HashMap Partitioning',
          whyRecommended: 'High-frequency interview question grouping strings by canonical character signatures.',
          url: 'https://leetcode.com/problems/group-anagrams/',
          platform: 'LeetCode',
          acceptanceRate: '68%',
        },
        {
          difficulty: 'Advanced',
          title: 'Rotate Image',
          concept: '2D Matrix Transposition & Inversion',
          whyRecommended: 'Tests multi-dimensional matrix index manipulation without allocating a secondary buffer.',
          url: 'https://leetcode.com/problems/rotate-image/',
          platform: 'LeetCode',
          acceptanceRate: '73%',
        },
      ],
    },
    assessmentQuestions: [
      {
        id: 'tcs-q1',
        dimension: 'coreCs',
        dimensionLabel: 'Core CS Foundations & ACID Properties',
        question: 'In a banking application transfer from Account A to Account B, what happens if the server crashes after debiting A but before crediting B?',
        context: 'TCS tests database transaction atomicity, consistency, and rollbacks.',
        options: [
          {
            id: 'a',
            text: 'Enclose both operations in a single database transaction: atomicity ensures that if the server crashes before completion, the entire transaction rolls back automatically.',
            rationale: 'Demonstrates deep understanding of ACID transaction atomicity.',
            score: 5,
          },
          {
            id: 'b',
            text: 'The money is permanently lost, so the customer will need to file a manual claim.',
            rationale: 'Fails basic software engineering and financial compliance standards.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Run two independent SQL queries and hope the network connection stays active.',
            rationale: 'Guarantees financial discrepancies whenever failures occur.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Use a saga pattern with compensating transactions for distributed cross-bank systems.',
            rationale: 'Advanced distributed pattern, highly regarded for microservices.',
            score: 4,
          },
        ],
      },
      {
        id: 'tcs-q2',
        dimension: 'projectWalkthrough',
        dimensionLabel: 'Project Defense & Architectural Clarity',
        question: 'When asked in an interview: "What was the most challenging technical blocker in your resume project and how did you resolve it?"',
        context: 'TCS interviewers expect genuine, detailed project ownership rather than superficial summaries.',
        options: [
          {
            id: 'a',
            text: 'Use the STAR method: describe the exact context, the bottleneck (e.g. N+1 database queries causing 800ms delays), the profiling tool used, the fix implemented, and the measured improvement.',
            rationale: 'Compelling, structured, and proves hands-on technical authenticity.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Say that you encountered no blockers because everything was easy and worked on the first try.',
            rationale: 'Unbelievable and suggests the candidate did not write the code.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Say that another team member did all the difficult parts while you watched.',
            rationale: 'Demonstrates complete lack of technical initiative.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Explain a configuration error you resolved by searching Stack Overflow.',
            rationale: 'Relatable, but discussing architectural or algorithmic challenges is far more impressive.',
            score: 3,
          },
        ],
      },
      {
        id: 'tcs-q3',
        dimension: 'workEthic',
        dimensionLabel: 'Work Ethic & Client Delivery Excellence',
        question: 'A critical client release is scheduled for tomorrow morning, but the automated test suite fails due to a missing environment configuration.',
        context: 'TCS prioritizes reliable delivery commitments and constructive team support.',
        options: [
          {
            id: 'a',
            text: 'Collaborate with the DevOps/QA engineer to debug the environment mismatch, verify the fix across the pipeline, and ensure clean deployment.',
            rationale: 'High ownership and dependable execution under deadline pressure.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Turn off the automated tests to make the pipeline pass green and ship anyway.',
            rationale: 'Dangerous practice that introduces undetected production regressions.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Log off and go home because your normal shift hours ended.',
            rationale: 'Lacks commitment during high-stakes release milestones.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Escalate to the technical lead immediately with logs and suggest a temporary config override in staging.',
            rationale: 'Proactive escalation and shows clear situational awareness.',
            score: 4,
          },
        ],
      },
      {
        id: 'tcs-q4',
        dimension: 'dataStructures',
        dimensionLabel: 'Data Structures Choice',
        question: 'You need to maintain a collection of student IDs and retrieve any student record instantly by their ID. Which data structure should you choose?',
        context: 'TCS technical screening assesses practical data structure selection.',
        options: [
          {
            id: 'a',
            text: 'HashMap / Dictionary: provides average O(1) constant time lookups using key hashing.',
            rationale: 'Optimal data structure choice with clear algorithmic justification.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Unsorted Array: requires O(n) linear search scanning every element sequentially.',
            rationale: 'Inefficient for frequent lookup operations.',
            score: 2,
          },
          {
            id: 'c',
            text: 'Linked List: requires O(n) node traversal from the head.',
            rationale: 'Poor choice for random access lookup.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Sorted Array with Binary Search: provides O(log n) lookups, but slower O(n) insertions.',
            rationale: 'Acceptable if the collection is static and read-heavy.',
            score: 3,
          },
        ],
      },
    ],
    sampleQuestions: [
      { type: 'Coding', question: 'Check if a string is an anagram or palindrome; implement binary search.' },
      { type: 'Technical', question: 'What are ACID properties in database management systems?' },
      { type: 'Technical', question: 'Explain how polymorphism and abstraction were applied in your resume project.' },
    ],
  },
  {
    id: 'zoho',
    name: 'Zoho',
    tier: 'Product/Scaleup',
    interviewStyle: 'Deep, fundamental low-level coding without heavy frameworks; building data structures from scratch, logic puzzles, and low-level system design.',
    primaryCodingFocus: ['Matrix manipulation', 'Recursion & Backtracking', 'Custom Data Structures from scratch', 'String parsing without library shortcuts'],
    systemDesignFocus: ['Low-level class design (LLD)', 'Custom MVC implementation', 'Efficient memory usage', 'Relational database schema design'],
    behavioralFocus: ['Hands-on engineering passion', 'Self-reliance', 'Zero entitlement', 'Long-term product commitment'],
    hiringBarNote: 'Expects candidates to write raw algorithms without relying on built-in language helpers (e.g. reverse string or implement split manually).',
    coreLeetCodeConcept: {
      concept: 'Matrix Traversal & Backtracking (Zero-Library Pure Logic)',
      explanation: 'Constructs custom multi-dimensional grids, recursive permutations, and pointer sweeps without relying on external packages.',
      whyRequired: 'Zoho round 2 & 3 explicitly prohibit high-level library functions (e.g. reverse, split, regex), testing pure algorithmic problem solving.',
      problems: [
        {
          difficulty: 'Basic',
          title: 'Spiral Matrix',
          concept: '2D Grid Boundary Traversal',
          whyRecommended: 'Top Zoho signature coding problem; requires managing four dynamic directional boundary pointers without helper libraries.',
          url: 'https://leetcode.com/problems/spiral-matrix/',
          platform: 'LeetCode',
          acceptanceRate: '48%',
        },
        {
          difficulty: 'Intermediate',
          title: 'Generate Parentheses',
          concept: 'Backtracking & Recursive Pruning',
          whyRecommended: 'Classic Zoho recursion test evaluating state branching, valid prefix constraints, and backtracking unwinding.',
          url: 'https://leetcode.com/problems/generate-parentheses/',
          platform: 'LeetCode',
          acceptanceRate: '74%',
        },
        {
          difficulty: 'Advanced',
          title: 'Sudoku Solver',
          concept: 'Exact Cover Matrix Backtracking',
          whyRecommended: 'Ultimate Zoho advanced coding challenge testing 9x9 grid validation, recursive backtracking, and constraint pruning.',
          url: 'https://leetcode.com/problems/sudoku-solver/',
          platform: 'LeetCode',
          acceptanceRate: '60%',
        },
      ],
    },
    assessmentQuestions: [
      {
        id: 'zoho-q1',
        dimension: 'firstPrinciples',
        dimensionLabel: 'First-Principles Engineering (No Library Shortcuts)',
        question: 'You must implement a string splitting function in C/Java/Python without using any built-in functions like .split() or regex.',
        context: 'Zoho tests whether you can build core software primitives from scratch rather than just gluing frameworks together.',
        options: [
          {
            id: 'a',
            text: 'Iterate over character indices with pointers tracking word start and end, allocating new string slices when encountering delimiter characters.',
            rationale: 'Demonstrates deep fundamental mastery of memory, pointers, and string representation.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Import a third-party npm or pip package that does it in one line.',
            rationale: 'Instant disqualification in Zoho technical rounds: completely misses the purpose of testing raw coding ability.',
            score: 1,
          },
          {
            id: 'c',
            text: 'Complain that nobody writes custom split methods in modern development.',
            rationale: 'Shows resistance to foundational algorithmic thinking.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Use a dynamic array or ArrayList to store the collected substring chunks dynamically.',
            rationale: 'Practical approach to handle dynamic word counts.',
            score: 4,
          },
        ],
      },
      {
        id: 'zoho-q2',
        dimension: 'lldDesign',
        dimensionLabel: 'Low-Level System Design (LLD)',
        question: 'Design a console-based Railway Reservation System with tickets, waitlists, berths (Upper, Middle, Lower), and cancellations.',
        context: 'Zoho Round 3 asks candidates to design and implement complete working class architectures in 2.5 hours.',
        options: [
          {
            id: 'a',
            text: 'Design clean OOP classes (Passenger, Ticket, Berth, ReservationSystem), manage Queues for waitlists, and implement cancel/reallocate methods with unit tests.',
            rationale: 'Exact Zoho LLD benchmark: comprehensive object-oriented structure with working state transitions.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Write 1,000 lines of procedural code inside a single main() function with 30 global arrays.',
            rationale: 'Disorganized spaghetti code that fails modularity and maintainability standards.',
            score: 2,
          },
          {
            id: 'c',
            text: 'Create mock UI mockups in Figma instead of writing working code.',
            rationale: 'Zoho LLD requires working Java/C++/Python backend logic, not visual mockups.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Model with enum BerthType and separate controller logic from data storage classes.',
            rationale: 'Clean and structured software engineering design.',
            score: 4,
          },
        ],
      },
      {
        id: 'zoho-q3',
        dimension: 'craftCommitment',
        dimensionLabel: 'Engineering Passion & Self-Reliance',
        question: 'Why do you want to work at Zoho where products are built in-house from database engines to UI components rather than using third-party SaaS?',
        context: 'Zoho looks for engineers who love building core technological foundations rather than superficial integration wrappers.',
        options: [
          {
            id: 'a',
            text: 'I have a genuine passion for understanding how systems work under the hood, from byte storage to networking, and pride in building enduring software from scratch.',
            rationale: 'Resonates deeply with Zoho culture and long-term product philosophy.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Because Zoho gives good employee snacks and free bus transportation.',
            rationale: 'Superficial motivation that ignores engineering ethos.',
            score: 1,
          },
          {
            id: 'c',
            text: 'I just need any job to get my career started.',
            rationale: 'Lacks personal ambition and genuine alignment with product craft.',
            score: 2,
          },
          {
            id: 'd',
            text: 'I value autonomy, stability, and working on products used by millions of small businesses globally.',
            rationale: 'Strong business awareness and respect for company impact.',
            score: 4,
          },
        ],
      },
      {
        id: 'zoho-q4',
        dimension: 'matrixLogic',
        dimensionLabel: 'Matrix & Multi-Dimensional Logic',
        question: 'Given an NxN matrix of numbers, you need to rotate it 90 degrees clockwise in-place without creating a secondary matrix.',
        context: 'Zoho tests spatial 2D array transformations and boundary arithmetic.',
        options: [
          {
            id: 'a',
            text: 'Transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each individual row. Both steps operate in-place with O(1) extra space.',
            rationale: 'Mathematically elegant, clean, and satisfies strict in-place memory requirements.',
            score: 5,
          },
          {
            id: 'b',
            text: 'Allocate a new NxN matrix and copy elements: newMatrix[j][n-1-i] = matrix[i][j].',
            rationale: 'Correct logic, but violates the strict in-place O(1) auxiliary space constraint.',
            score: 3,
          },
          {
            id: 'c',
            text: 'Flatten into a 1D array and sort all numbers.',
            rationale: 'Completely changes the matrix elements and produces an incorrect result.',
            score: 1,
          },
          {
            id: 'd',
            text: 'Rotate layer-by-layer using a 4-way variable swap around the perimeter boundaries.',
            rationale: 'Valid in-place approach, though requires more complex coordinate tracking.',
            score: 4,
          },
        ],
      },
    ],
    sampleQuestions: [
      { type: 'Coding', question: 'Print a matrix in spiral order; find all substrings that form palindromes without helper functions.' },
      { type: 'System Design', question: 'Design a console-based Railway Reservation System or Call Taxi Booking System with classes and data models.' },
      { type: 'Behavioral', question: 'Why do you prefer building core software over relying on third-party frameworks?' },
    ],
  },
];

/**
 * Returns company profile or generates a high-standard profile for custom companies
 */
export function getCompanyProfile(companyName?: string): ICompanyProfile {
  if (!companyName || !companyName.trim()) {
    return POPULAR_COMPANIES[0]; // Google as default benchmark
  }

  const clean = companyName.trim().toLowerCase();
  const found = POPULAR_COMPANIES.find(
    c =>
      c.name.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      c.name.toLowerCase().includes(clean) ||
      clean.includes(c.name.toLowerCase())
  );

  if (found) return found;

  // Generate dynamic company-aligned profile for any custom company
  const fallback = POPULAR_COMPANIES[0];
  return {
    id: clean.replace(/[^a-z0-9]/g, '-'),
    name: companyName.trim(),
    tier: 'Product/Scaleup',
    interviewStyle: `Company-aligned technical interview focusing on core software engineering rigor, production architecture, and role-specific requirements at ${companyName}.`,
    primaryCodingFocus: ['Data Structures & Algorithms', 'Array & String manipulation', 'HashMaps & Sets', 'Time & Space complexity analysis'],
    systemDesignFocus: ['Scalable service architecture', 'RESTful API contracts', 'Data modeling & database choice', 'Error handling & monitoring'],
    behavioralFocus: ['Communication clarity', 'Technical problem solving ownership', 'Collaboration & cultural alignment', 'STAR-method past experiences'],
    hiringBarNote: `Preparation is company-aligned to industry standards for ${companyName}. Evaluates real-world software craft and architectural maturity.`,
    coreLeetCodeConcept: {
      concept: 'Hash Tables & Two Pointers (High-Impact Algorithmic Fundamentals)',
      explanation: `Optimizes lookup times and linear space-time trade-offs required by ${companyName} technical interview screeners.`,
      whyRequired: `Evaluates clean coding, optimal algorithmic complexity, and handling edge cases for ${companyName} interview rounds.`,
      problems: [
        {
          difficulty: 'Basic',
          title: 'Two Sum',
          concept: 'HashMap Complement Lookup',
          whyRecommended: `Quintessential problem testing O(n) space-time trade-off demanded in ${companyName} initial rounds.`,
          url: 'https://leetcode.com/problems/two-sum/',
          platform: 'LeetCode',
        },
        {
          difficulty: 'Intermediate',
          title: 'Longest Substring Without Repeating Characters',
          concept: 'Sliding Window & Hash Set',
          whyRecommended: `Demonstrates sliding window traversal and memory-efficient tracking expected by ${companyName}.`,
          url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
          platform: 'LeetCode',
        },
        {
          difficulty: 'Advanced',
          title: 'LRU Cache',
          concept: 'Doubly Linked List & HashMap',
          whyRecommended: `Tests production-grade system building with simultaneous O(1) get/put operations for ${companyName}.`,
          url: 'https://leetcode.com/problems/lru-cache/',
          platform: 'LeetCode',
        },
      ],
    },
    assessmentQuestions: fallback.assessmentQuestions,
    sampleQuestions: [
      { type: 'Coding', question: `Implement efficient algorithmic solution for target data processing at ${companyName}.` },
      { type: 'System Design', question: `Architect scalable microservices or client application tailored to ${companyName}'s product domain.` },
      { type: 'Behavioral', question: `Why are you interested in joining ${companyName}, and how does your experience align with their technical mission?` },
    ],
  };
}
