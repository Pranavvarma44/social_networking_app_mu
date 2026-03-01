export async function paginate(model, filter = {}, query = {}, options = {}) {
    const page = parseInt(query.page) > 0 ? parseInt(query.page) : 1;
    const limit = parseInt(query.limit) > 0 ? parseInt(query.limit) : 10;
  
    const skip = (page - 1) * limit;
  
    const total = await model.countDocuments(filter);
  
    const data = await model
      .find(filter)
      .select(options.select || "")
      .sort(options.sort || { createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
    const totalPages = Math.ceil(total / limit);
  
    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }