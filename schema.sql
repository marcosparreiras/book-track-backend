CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  avatar_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMP NOT NULL
);

CREATE TABLE comments (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL, 
 book_id TEXT NOT NULL, 
 content TEXT NOT NULL,
 rate INTEGER NOT NULL,
 CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 CONSTRAINT book_fk FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

INSERT INTO users (id, name, email, password, avatar_url, is_admin)
VALUES ('511aafc4-3b51-4f18-adb8-1fde5eb5ed1a', 'Admin', 'admin@example.com', '$2a$12$HU8ZcOWc6PNsPK3ZtJMyqOEQr2xKfleY.YKN87HgucQ2puDdYWuMe', NULL, TRUE);
-- Senha 123456

INSERT INTO books (id, title, author, description, image_url, published_at) VALUES
  ('fd4f25fc-ee8d-41eb-aa4c-d214e08ded2b', 'Clean Code', 'Robert C. Martin', 'Um guia para escrever código limpo e de fácil manutenção.', 'https://marcos-booktrak-demo.s3.amazonaws.com/fd4f25fc-ee8d-41eb-aa4c-d214e08ded2b.jpg', '2008-08-01'),
  ('0f69fbe9-e43e-43b8-9a55-5cb6bace4825', 'The Pragmatic Programmer', 'Andrew Hunt & David Thomas', 'Ensina abordagens práticas e flexíveis ao desenvolvimento de software.', 'https://marcos-booktrak-demo.s3.amazonaws.com/0f69fbe9-e43e-43b8-9a55-5cb6bace4825.jpg', '1999-10-20'),
  ('43544ec1-c51d-4c52-b710-7a05d2f28333', 'Refactoring', 'Martin Fowler', 'Melhore a estrutura interna de software existente sem alterar seu comportamento externo.', 'https://marcos-booktrak-demo.s3.amazonaws.com/43544ec1-c51d-4c52-b710-7a05d2f28333.jpg', '1999-06-28'),
  ('ea61428f-15a0-4ec0-ac0d-13d2e0b1dbbd', 'Design Patterns', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 'Padrões de projeto que fornecem soluções reutilizáveis a problemas recorrentes.', 'https://marcos-booktrak-demo.s3.amazonaws.com/ea61428f-15a0-4ec0-ac0d-13d2e0b1dbbd.jpg', '1994-10-21'),
  ('73781906-6b9b-4957-bb5c-f570fbad7f99', 'Domain-Driven Design', 'Eric Evans', 'Aborda a modelagem de software com foco no domínio do problema.', 'https://marcos-booktrak-demo.s3.amazonaws.com/73781906-6b9b-4957-bb5c-f570fbad7f99.jpg', '2003-08-30'),
  ('acc9e071-3ef1-4156-9bce-c298fc48dbe1', 'Continuous Delivery', 'Jez Humble & David Farley', 'Automatize e entregue software rapidamente, de forma confiável.', 'https://marcos-booktrak-demo.s3.amazonaws.com/acc9e071-3ef1-4156-9bce-c298fc48dbe1.jpg', '2010-07-27'),
  ('44e9ed82-c1af-4212-a982-6e911bc61655', 'Infrastructure as Code', 'Kief Morris', 'Práticas para gerenciar infraestruturas de TI usando técnicas de desenvolvimento de software.', 'https://marcos-booktrak-demo.s3.amazonaws.com/44e9ed82-c1af-4212-a982-6e911bc61655.jpg', '2016-06-05'),
  ('fcde0b5f-ead1-40ed-979f-5a07cd3b034b', 'Site Reliability Engineering', 'Niall Richard Murphy, Betsy Beyer, Chris Jones, Jennifer Petoff', 'Como a engenharia de confiabilidade mantém sistemas grandes e complexos operacionais.', 'https://marcos-booktrak-demo.s3.amazonaws.com/fcde0b5f-ead1-40ed-979f-5a07cd3b034b.jpg', '2016-03-23'),
  ('0ba3f6a4-9985-463c-8825-2452ec059e5d', 'The Phoenix Project', 'Gene Kim, Kevin Behr, George Spafford', 'Uma história sobre a transformação DevOps e a eficiência do fluxo de trabalho.', 'https://marcos-booktrak-demo.s3.amazonaws.com/0ba3f6a4-9985-463c-8825-2452ec059e5d.jpg', '2013-01-10'),
  ('a9dac34f-5b31-47f9-a715-68cb1b530c79', 'Kubernetes Up & Running', 'Kelsey Hightower, Brendan Burns, Joe Beda', 'Introdução prática ao Kubernetes para gerenciar contêineres.', 'https://marcos-booktrak-demo.s3.amazonaws.com/a9dac34f-5b31-47f9-a715-68cb1b530c79.jpg', '2017-09-07'),
  ('43ef28ca-eedb-40ba-9ddb-7491c4fa3b42', 'The DevOps Handbook', 'Gene Kim, Patrick Debois, John Willis, Jez Humble', 'Guia para implementar DevOps em sua organização.', 'https://marcos-booktrak-demo.s3.amazonaws.com/43ef28ca-eedb-40ba-9ddb-7491c4fa3b42.jpg', '2016-10-06'),
  ('e8dbdc23-dee5-48ea-914a-205b4e0f13fe', 'Cloud Native Patterns', 'Cornelia Davis', 'Padrões para construir sistemas distribuídos e resilientes na nuvem.', 'https://marcos-booktrak-demo.s3.amazonaws.com/e8dbdc23-dee5-48ea-914a-205b4e0f13fe.jpg', '2019-05-10'),
  ('73e5b278-c2e7-4ed3-819f-ee76526a754d', 'Learning Docker', 'Pethuru Raj, Jeeva S. Chelladhurai, Vinod Singh', 'Guia prático para usar Docker e gerenciar contêineres.', 'https://marcos-booktrak-demo.s3.amazonaws.com/73e5b278-c2e7-4ed3-819f-ee76526a754d.jpg', '2015-12-23'),
  ('98dcfaed-b4f0-4a63-981f-5692976f72e1', 'Building Microservices', 'Sam Newman', 'Introdução à arquitetura de microservices e como implementá-los.', 'https://marcos-booktrak-demo.s3.amazonaws.com/98dcfaed-b4f0-4a63-981f-5692976f72e1.jpg', '2015-02-20'),
  ('d3299053-836a-44de-b833-ae88a82f919c', 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', 'Aurélien Géron', 'Aplicações práticas de machine learning com Python.', 'https://marcos-booktrak-demo.s3.amazonaws.com/d3299053-836a-44de-b833-ae88a82f919c.jpg', '2017-03-13'),
  ('ea3cfdb3-b1a2-44cd-8425-cf4cfaf6b4f0', 'The Art of Scalability', 'Martin L. Abbott, Michael T. Fisher', 'Estratégias para projetar sistemas escaláveis.', 'https://marcos-booktrak-demo.s3.amazonaws.com/ea3cfdb3-b1a2-44cd-8425-cf4cfaf6b4f0.jpg', '2015-05-11'),
  ('42d005c1-40cc-4bc1-b149-a0b352490ba1', 'Docker Deep Dive', 'Nigel Poulton', 'Uma imersão técnica sobre o funcionamento do Docker.', 'https://marcos-booktrak-demo.s3.amazonaws.com/42d005c1-40cc-4bc1-b149-a0b352490ba1.jpg', '2016-10-19'),
  ('e6bc0173-009a-4ac2-92bd-09b156627809', 'Terraform: Up & Running', 'Yevgeniy Brikman', 'Como usar Terraform para gerenciar sua infraestrutura como código.', 'https://marcos-booktrak-demo.s3.amazonaws.com/e6bc0173-009a-4ac2-92bd-09b156627809.jpg', '2017-03-13'),
  ('6ccaf67f-007e-4504-aea7-6fcefac14573', 'Architecting the Cloud', 'Michael J. Kavis', 'Como criar arquiteturas baseadas em nuvem eficientes.', 'https://marcos-booktrak-demo.s3.amazonaws.com/6ccaf67f-007e-4504-aea7-6fcefac14573.jpg', '2014-01-28'),
  ('7ca784bd-6a12-48ab-be3c-a06e97514b1b', 'Cloud Native DevOps with Kubernetes', 'John Arundel & Justin Domingus', 'Práticas de DevOps aplicadas em um ambiente de Kubernetes.', 'https://marcos-booktrak-demo.s3.amazonaws.com/7ca784bd-6a12-48ab-be3c-a06e97514b1b.jpg', '2019-08-30'),
  ('9ed59a46-afd0-4051-9d23-1677cbd439cd', 'Microservices Patterns', 'Chris Richardson', 'Padrões para desenvolvimento de microservices escaláveis e resilientes.', 'https://marcos-booktrak-demo.s3.amazonaws.com/9ed59a46-afd0-4051-9d23-1677cbd439cd.jpg', '2018-11-19');
