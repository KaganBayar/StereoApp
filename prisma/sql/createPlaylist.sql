--@param {String} $1:ID

INSERT INTO "Playlist" (id, name, user_id, description , created_at)
VALUES (gen_random_uuid(), 'My Playlist', $1, 'This is my playlist' , NOW())
RETURNING id;


