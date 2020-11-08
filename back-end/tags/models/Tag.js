const mongoose = require('../../common/services/mongoose-starter').mongoose;
const Schema = mongoose.Schema;


const tagSchema = new Schema({
    name: String,
    countUsedInSnippets: { type: Number, min: 0, default: 0 }, 
    countLikesInSnippets: { type: Number, min: 0, default: 0 }
}, {
    versionKey: false
});

tagSchema.virtual('id').get(function () {
    return this._id.toHexString();
});


const Tag = mongoose.model('Tag', tagSchema);

exports.model = Tag;

exports.findById = (tagId) => {
    return Tag.find({
        _id: tagId
    });
};

exports.findByName = (tagName) => {
    return Tag.find({
        name: tagName
    });
};

exports.list = (perPage, page, sortField) => {

    return new Promise((resolve, reject) => {
        const query = Tag.find()
            .limit(perPage)
            .skip(perPage * page);

            if(sortField) {
                query.sort({[sortField]: -1});
            }
            query.exec(function (err, tags) {
                if (err) {
                    return reject(err);
                }
                Tag.count({}, function(err, count){
                    if(err) {
                        return reject(err);
                    }
                    return resolve({
                        data: tags,
                        total: count 
                    });
                });
            });
    });
};

exports.createTag = (tagData) => {  
    const tag = new Tag(tagData);
    return tag.save();
};
   
exports.updateTag = (id, tagData) => {
    return Tag.findOneAndUpdate({
        _id: id
    }, tagData, { new: true });
};