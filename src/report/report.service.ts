import userModel from "../users/user.model";


export default class ReportService {
  private user = userModel;

  public generateReport = async () => {
    const usersByCountries = await this.user.aggregate(
      [
        {
          $match: {
            'address.country': {
              $exists: true,
            }
          }
        },
        {
          $group: {
            _id: {
              country: '$address.country',
            },
            users: {
              $push: {
                _id: '$_id',
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: 'posts',
            localField: 'users._id',
            foreignField: 'author',
            as: 'articles',
          }
        },
        {
          $addFields: {
            amountOfArticles: {
              $size: '$articles'
            }
          },
        },
        {
          $sort: {
            count: 1,
          },
        },
      ]
    );
    return usersByCountries;
  }
}