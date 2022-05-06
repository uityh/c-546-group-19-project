const mongoCollections = require("../config/mongoCollections");
const validation = require("../validation/outfits_validation");
const clothesData = require('../data/clothes');
const outfits = mongoCollections.outfits;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");



module.exports = {
    //export list
    //get (public) outfit by id
    async get_outfit_by_id(id) {
        //check id
        let outfit;

        const outfitsCollection = await outfits();
        if (outfitsCollection) {
            outfit = await outfitsCollection.findOne({ status: 'public', _id: ObjectId(id) });

            if (!outfit) {
                throw "no user found";
            }

            return outfit;

        }
        throw "error in getting outfits collection"
    },

    //get all comments

    async get_all_comments(id){
        let outfit;

        const outfitsCollection = await outfits();
        if (outfitsCollection) {
            outfit = await outfitsCollection.findOne({ status: 'public', _id: ObjectId(id) });

            if (!outfit) {
                throw "no user found";
            }
        }
        //return an array 
        console.log(outfit);
        return outfit.comments;
    },


    //update comments

    async add_comment(id, commenter, text) {
        //check id
        let outfit;

        const outfitsCollection = await outfits();
        if (outfitsCollection) {
            outfit = await outfitsCollection.findOne({ status: 'public', _id: ObjectId(id) });

            if (!outfit) {
                throw "no user found";
            }
        }

        let newComment = {
            _id: ObjectId(),
            commenter: commenter,
            text: text
        };

        //if somehow doesnt have comment
        if (!outfit.comments) {
            outfit.comments = [];
        }

        outfit.comments.push(newComment);

        let updatedOutfit = {
            creator: outfit.creator,
            clothes: outfit.clothes,
            likes: outfit.likes,
            status: outfit.status,
            outfitName: outfit.outfitName,
            season: outfit.season,
            style: outfit.style,
            comments: outfit.comments
        };


        const updatedInfo = await outfitsCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: updatedOutfit }
        );

        if (updatedInfo.modifiedCount === 0) {
            throw "Cout not comemnt successfully";
        };

        return newComment;
    },

    

    //update likes

    async update_like(id) {
        //check id
        let outfit;

        const outfitsCollection = await outfits();
        if (outfitsCollection) {
            outfit = await outfitsCollection.findOne({ status: 'public', _id: ObjectId(id) });

            if (!outfit) {
                throw "no user found";
            }
        }
        let num = outfit.likes+1;

        let updatedOutfit = {
            creator: outfit.creator,
            clothes: outfit.clothes,
            likes: num,
            status: outfit.status,
            outfitName: outfit.outfitName,
            season: outfit.season,
            style: outfit.style,
            comments: outfit.comments
        };


        const updatedInfo = await outfitsCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: updatedOutfit }
        );

        if (updatedInfo.modifiedCount === 0) {
            throw "Cout not comemnt successfully";
        };

        return num;
    }


};
