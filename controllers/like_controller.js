const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(req, res) {
    try {

        //likes/toggle/?id=abcdef&type=Post
        let Likeable;
        let deleted = false;
        if(req.query.type == 'Post') {
            Likeable = await Post.findById(req.query.id).populate('likes');
        } else {
            Likeable= await Comment.findById(req.query.id).populate('likes');
        }

        // check if like already exist
        let existingLike = await await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user:req.user._id
        })
        if(existingLike) {
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;
        } else {
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query/type
            });

            likeable.likes.push(newLike._id);
            likeable.save();


        }

        return res.json(200, {
            message: "request successful",
            data: {
                deleted: deleted
            }
        })

    } catch(err) {
        return res.json(500, {
            message: 'Internal servor Error'
        });
    }
    
}