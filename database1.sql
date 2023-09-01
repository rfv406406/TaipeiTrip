SHOW DATABASES;
USE  taipeiattractions;
SHOW TABLES;
CREATE TABLE attractions(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
	description TEXT,
    address VARCHAR(255),
    transport TEXT,
    lng VARCHAR(255),
    lat VARCHAR(255),
    categorynumber BIGINT,
    mrtnumber BIGINT
    -- FOREIGN KEY (category) REFERENCES categories(id),
-- 	FOREIGN KEY (mrt) REFERENCES mrts(id)
);
CREATE TABLE images(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    URL_image TEXT,
    attractions BIGINT
    -- FOREIGN KEY (attractions) REFERENCES attractions(id)
);
CREATE TABLE mrts(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    mrt VARCHAR(255) 
);
CREATE TABLE categories(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(255) 
);
SELECT * FROM attractions;
SELECT * FROM images;
SELECT * FROM mrts;
SELECT * FROM categories;

-- SELECT attractions.id, attractions.name, attractions.description, attractions.address, attractions.transport, attractions.lat, attractions.lng, mrts.mrt, categories.category FROM attractions INNER JOIN mrts ON mrts.id = attractions.mrtnumber INNER JOIN categories ON categories.id = attractions.categorynumber;
-- SELECT attractions.id, attractions.name, attractions.category, attractions.description, attractions.address, attractions.transport, attractions.mrt, attractions.lat, attractions.lng, images.URL_image FROM attractions LEFT JOIN images ON attractions.id=images.attractions;
-- SELECT mrts.id,mrts.name,attractions.mrt FROM mrts INNER JOIN attractions ON mrts.id=attractions.mrt;
-- SELECT mrts.id, mrts.mrt, COUNT(attractions.mrtnumber) as count_mrt FROM mrts INNER JOIN attractions ON mrts.id = attractions.mrtnumber GROUP BY mrts.id, mrts.mrt ORDER BY count_mrt DESC;

-- ALTER TABLE attractions ADD FOREIGN KEY(categorynumber) REFERENCES categories(category);
-- ALTER TABLE attractions ADD FOREIGN KEY(mrtnumber) REFERENCES mrts(mrt);
-- ALTER TABLE images ADD FOREIGN KEY(attractions) REFERENCES attractions(id);

DROP TABLE images;
DROP TABLE attractions;
DROP TABLE mrts;
DROP TABLE categories;
DROP DATABASE taipeiattractions;
