--@param {String} $1:ID

INSERT INTO "Playlist" (id, name, description, user_id, created_at, updated_at,  photo)
VALUES (gen_random_uuid(), 'My Playlist', 'This is my playlist', $1, NOW(), NOW(), 'default.jpg')
RETURNING id;


