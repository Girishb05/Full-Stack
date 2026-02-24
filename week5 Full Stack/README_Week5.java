// ═══════════════════════════════════════════════════════════════════
//  WEEK 5 — README  (pom.xml + properties + endpoints)
//  File: README_Week5.java
// ═══════════════════════════════════════════════════════════════════

/*
════════════════════════════════════════════════════════════
  POM.XML — All Week 5 dependencies
════════════════════════════════════════════════════════════

<dependencies>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- MySQL (production) -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- H2 (quick in-memory testing — no MySQL setup needed) -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>

</dependencies>


════════════════════════════════════════════════════════════
  application.properties  (H2 in-memory — works without MySQL)
════════════════════════════════════════════════════════════

server.port=8085

# H2 In-Memory DB (no MySQL needed — great for quick testing)
spring.datasource.url=jdbc:h2:mem:studentdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# H2 Console — view DB at http://localhost:8085/h2-console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console


════════════════════════════════════════════════════════════
  application.properties  (MySQL — production use)
════════════════════════════════════════════════════════════

spring.datasource.url=jdbc:mysql://localhost:3306/studentdb
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true


════════════════════════════════════════════════════════════
  SESSION SUMMARY & ENDPOINTS
════════════════════════════════════════════════════════════

  SESSION 21 — JDBC Connection
  File: Session21_JdbcConfig.java
  GET  /db/test             → confirms JDBC datasource works
  GET  /db/version          → returns DB version string
  H2 console: http://localhost:8085/h2-console

  SESSION 22 — JPA Entity Mapping
  File: Session22_JpaEntity.java
  GET  /student/schema      → shows ORM mapping details
  Hibernate auto-creates 'students' table from @Entity on startup

  SESSION 23 — Student CRUD (Postman)
  File: Session23_StudentCRUD.java
  POST   /students          Body: {"name":"..","department":"..","age":21,"email":".."}
  GET    /students          → all students
  GET    /students/1        → by ID
  PUT    /students/1        Body: updated JSON
  DELETE /students/1        → delete

  SESSION 24 & 25 — Data Access Layer (JpaRepository + @Query)
  File: Session24_25_DataAccessLayer.java
  GET  /data/students                     → all
  GET  /data/students/1                   → by ID
  GET  /data/students/dept/CSE            → by department
  GET  /data/students/age/20              → exact age
  GET  /data/students/age/above/21        → age > 21
  GET  /data/students/age/range/20/22     → age between
  GET  /data/students/filter?dept=CSE&age=20
  GET  /data/students/search?name=ravi    → name contains
  GET  /data/students/dept/CSE/sorted     → custom @Query
  GET  /data/students/dept/CSE/age/above/20
  GET  /data/students/count/dept          → native SQL group by
  GET  /data/students/dept/CSE/youngest
  GET  /data/students/count               → total count
  POST /data/students                     → create
  DELETE /data/students/1                 → delete


════════════════════════════════════════════════════════════
  KEY CONCEPTS COVERED — WEEK 5
════════════════════════════════════════════════════════════

  JdbcTemplate     Spring JDBC helper — eliminates boilerplate SQL code
  @Entity          Marks class as JPA entity — mapped to DB table
  @Table           Specifies DB table name
  @Id              Marks primary key field
  @GeneratedValue  Auto-increment strategy for PK
  @Column          Maps field to DB column with name/constraints
  JpaRepository    Interface — gives save/findAll/findById/delete for free
  Derived Queries  findByDepartment(), findByAge() — Spring generates SQL
  @Query (JPQL)    Custom queries using Java class/field names
  @Query native    Raw SQL queries with nativeQuery=true
  @Param           Binds method parameter to @Query named parameter
  ddl-auto=update  Hibernate creates/updates table from entity on startup
  H2 Console       In-browser DB viewer at /h2-console for development
*/
