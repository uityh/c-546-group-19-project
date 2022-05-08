const sanitizer = require('sanitizer');
module.exports = {
    checkId(id) {
        if (!id) throw 'You must provide an id to search for';
        if (typeof id !== 'string') throw 'Id must be a string';
        if (id.trim().length === 0)
            throw 'Id cannot be an empty string or just spaces';
        id = id.trim();
        id = sanitizer.sanitize(id)
        if (!ObjectId.isValid(id)) throw 'invalid object ID';
        return id;
    }
}
