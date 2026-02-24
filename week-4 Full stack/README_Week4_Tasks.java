// ═══════════════════════════════════════════════════════════════════
//  WEEK 4 — Spring Boot Tasks 4.1 to 4.7
//  README.java — Project Setup & Run Instructions
// ═══════════════════════════════════════════════════════════════════

/*
════════════════════════════════════════════════════════════
  POM.XML DEPENDENCIES  (same for all 7 tasks)
════════════════════════════════════════════════════════════

<dependencies>

    <!-- Spring Boot Web (Servlet + Embedded Tomcat) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Dev Tools (auto-restart on save) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>

    <!-- Thymeleaf (needed only for Task 4.7 HTML views) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>

</dependencies>


════════════════════════════════════════════════════════════
  application.properties  →  src/main/resources/
════════════════════════════════════════════════════════════

server.port=8085
spring.application.name=week4-spring-tasks


════════════════════════════════════════════════════════════
  FOLDER STRUCTURE
════════════════════════════════════════════════════════════

src/
 └── main/
      ├── java/
      │    └── com/week4/
      │         ├── task41/  → Task41Application.java
      │         ├── task42/  → Task42Application.java
      │         ├── task43/  → Task43Application.java
      │         ├── task44_45/ → Task44_45Application.java
      │         ├── task46/  → Task46Application.java
      │         └── task47/  → Task47Application.java
      └── resources/
           ├── application.properties
           └── templates/           ← Task 4.7 only
                ├── employees.html
                ├── employee-detail.html
                └── error.html


════════════════════════════════════════════════════════════
  TASK SUMMARY & TEST ENDPOINTS
════════════════════════════════════════════════════════════

TASK 4.1 — Basic Servlet Web App
  Run:  Task41Application.main()
  Test: GET  http://localhost:8085/hello
        GET  http://localhost:8085/info
  What: Proves embedded Tomcat starts, port configured via properties

──────────────────────────────────────────────────────────
TASK 4.2 — @Autowired Field Injection
  Run:  Task42Application.main()
  Test: GET  http://localhost:8085/greet
        GET  http://localhost:8085/greet/John
  What: GreetingController @Autowired GreetingService at field level

──────────────────────────────────────────────────────────
TASK 4.3 — Constructor Injection + PaymentService Interface
  Run:  Task43Application.main()
  Test: GET  http://localhost:8085/payment/process/500.00
        GET  http://localhost:8085/payment/status
  What: PaymentController injects PaymentServiceImpl via constructor

──────────────────────────────────────────────────────────
TASK 4.4 — @Qualifier for Multiple Beans
  Run:  Task44_45Application.main()
  Test: GET  http://localhost:8085/notify/email
        GET  http://localhost:8085/notify/sms
        GET  http://localhost:8085/notify/both
  What: @Qualifier("emailService") and @Qualifier("smsService")
        resolve ambiguity between 2 beans of same interface

──────────────────────────────────────────────────────────
TASK 4.5 — @Autowired(required=false) Optional Injection
  Run:  Task44_45Application.main()  (same file as 4.4)
  Test: GET  http://localhost:8085/notify/analytics
  What: Comment out @Component on AnalyticsService → restart
        → endpoint returns graceful null-handled message

──────────────────────────────────────────────────────────
TASK 4.6 — BeanFactory + IoC + DI Employee Management
  Run:  Task46Application.main()
  Test: GET  http://localhost:8085/employees
        GET  http://localhost:8085/employees/1
        GET  http://localhost:8085/employees/dept/IT
        POST http://localhost:8085/employees/add
             ?id=6&name=Kiran&dept=IT&salary=70000
  What: Full IoC chain Controller→Service→Repository
        BeanFactory demo in CommandLineRunner on startup

──────────────────────────────────────────────────────────
TASK 4.7 — Spring MVC (No XML, Annotation-based)
  Run:  Task47Application.main()

  REST endpoints (JSON):
    GET    http://localhost:8085/mvc/employees
    GET    http://localhost:8085/mvc/employees/1
    GET    http://localhost:8085/mvc/employees/search?name=Ravi
    GET    http://localhost:8085/mvc/employees/dept/IT
    POST   http://localhost:8085/mvc/employees
           Body: {"id":6,"name":"Sam","department":"IT",
                  "email":"sam@co.com","salary":75000}
    DELETE http://localhost:8085/mvc/employees/1

  HTML views (MVC flow — requires Thymeleaf templates):
    GET    http://localhost:8085/view/employees
    GET    http://localhost:8085/view/employees/1

  What: Full Spring MVC flow with Controller → Model → View
        No XML — 100% annotation-driven configuration


════════════════════════════════════════════════════════════
  KEY CONCEPTS COVERED
════════════════════════════════════════════════════════════

  @SpringBootApplication   Bootstraps Spring context, enables auto-config
  @RestController          HTTP endpoints, JSON responses
  @Controller              MVC endpoints, returns view name
  @Service                 Business logic bean
  @Repository              Data access bean
  @Component               Generic Spring bean
  @Autowired               Dependency injection (field/constructor/setter)
  @Qualifier               Resolves ambiguity when multiple beans match
  @Autowired(required=false) Optional injection, null if bean absent
  BeanFactory              Core container — manages bean lifecycle
  ApplicationContext       Extended BeanFactory with extra features
  Model (MVC)              Carries data from Controller to View
  Thymeleaf                Server-side template engine for HTML views
  CommandLineRunner        Runs code after Spring context is ready
  @PathVariable            Extracts value from URL path
  @RequestParam            Extracts query parameter from URL
  @RequestBody             Deserializes JSON request body to Java object
  ResponseEntity<T>        Full HTTP response control (status + body)

*/
