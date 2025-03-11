--@param {String} $1:email

SELECT 
    id
FROM
    "Users"
WHERE
    email = $1
LIMIT 1;