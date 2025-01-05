const Category = require("../models/Category");
// get Random Integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		// console.log(CategorysDetails); // Commented out for security
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
    try {
        // console.log("INSIDE SHOW ALL CATEGORIES"); // Commented out for security
		const allCategorys = await Category.find({
     
        });
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        // console.log("PRINTING CATEGORY ID: ", categoryId);

        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
       .populate({
    path: "courses",
    match: { status: "Published" },
    populate: [
        { path: "instructor" },
        { path: "ratingAndReviews" }
    ]
})
.exec();

        console.log('selectedCategory = ', selectedCategory)
        // Handle the case when the category is not found
        if (!selectedCategory) {
            // console.log("Category not found.")
            return res.status(404).json({ success: false, message: "Category not found" })
        }



        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            // console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                data: null,
                message: "No courses found for the selected category.",
            })
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
        )
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                    },
                    populate: {
                        path:"ratingAndReviews",
                        },
            })
            .exec()

        //console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
                populate: {
                    path: "ratingAndReviews",
                    },

            })
            .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)

        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

// deactive category 

exports.deactiveCategory = async (req, res) => {
    try {
        const {categoryId} = req.body
        const category = await Category
        .findById(categoryId)
        .exec()
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }
        category.Active = false
        await category.save()
        res.status(200).json({
            success: true,
            message: "Category deactivated successfully",
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

// update category
exports.updateCategory = async (req, res) => {
    try {
        const {categoryId} = req.body
        const category = await Category
        .findById(categoryId)
        .exec()
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }
        const { name, description,Active } = req.body
        if (name)
        {
            category.name = name
        }
        if (description)
        {
            category.description = description
        }
        if (Active)
        {
            category.Active = Active
        }

        await category.save()
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
        })
    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

