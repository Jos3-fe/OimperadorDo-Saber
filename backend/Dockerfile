# Use uma imagem base do OpenJDK 17
FROM openjdk:17-jdk-slim

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos do Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Dar permissão de execução ao mvnw
RUN chmod +x ./mvnw

# Baixar dependências
RUN ./mvnw dependency:go-offline -B

# Copiar código fonte
COPY src src

# Compilar aplicação
RUN ./mvnw clean package -DskipTests

# Expor porta
EXPOSE 8080

# Comando para executar a aplicação
CMD ["java", "-jar", "target/*.jar"]