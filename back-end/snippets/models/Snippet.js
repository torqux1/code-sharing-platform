const mongoose = require('../../common/services/mongoose-starter').mongoose;
const Schema = mongoose.Schema;

const snippetSchema = new Schema({
    name: String,
    description: String,
    code: String,
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag' }],
    isShared: { type: Number, enum: [0, 1], default: 0},
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    likedBy: {
        type : [{type: Schema.Types.ObjectId, ref: 'User'}],
        default : []
      }
}, {
    versionKey: false
});


snippetSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const Snippet = mongoose.model('Snippet', snippetSchema);

exports.model = Snippet;


exports.findById = (snippetId) => {
    return Snippet.find({
        _id: snippetId
    });
};

exports.findByProductId = function (products) {
    const productList = (typeof products !== 'array')? products : [products];

    return Snippet.find({ products : { "$in" : productList } });
};

exports.list = (perPage, page, relations, searchCriteria) => {
    return new Promise((resolve, reject) => {
        const query = Snippet.find(searchCriteria)
            .limit(perPage)
            .skip(perPage * page);

            if(relations){
                relations.forEach(relation => query.populate(relation));
            }
            query.exec(function (err, snippets) {
                if (err) {
                    return reject(err);
                }
                Snippet.count(searchCriteria, function(err, count){
                    if(err) {
                        return reject(err);
                    }
                    return resolve({
                        data: snippets,
                        total: count 
                    });
                });
            })
    });
};

exports.createSnippet = (snippetData) => {
    const snippet = new Snippet(snippetData);
    return snippet.save();
};


exports.updateSnippet = (id, snippetData) => {
    return Snippet.findOneAndUpdate({
        _id: id
    }, snippetData, { new: true });
};

exports.removeById = (snippetId) => {
    return Snippet.deleteOne({
        _id: snippetId
    });
};