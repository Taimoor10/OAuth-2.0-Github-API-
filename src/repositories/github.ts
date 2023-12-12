import CustomUserModel from "../database/model/customUser.model";
import FavoritesModel from "../database/model/favorites.model";
import UserModel from "../database/model/user.model";

/**
 * 
 * @param id 
 * @param repositoryName
 * @param owner 
 * @returns 
 */
const addFavoriteRepository = async(id: string, repositoryName: string, owner: string, email: string) => {
    
    let user: any;
    
    user = await UserModel.findOne({ where: {email: email } });
    if(!user)
      user = await CustomUserModel.findOne({where: {email: email}});
    if(!user)
        return new Error("User not registered");

    const favorite = await FavoritesModel.findOne({where: {email: email}});
    if(!favorite) {
        return FavoritesModel.create({
            id: id,
            repositoryName: [repositoryName],
            owner: owner,
            email: email
        })
    }
    if (!favorite.repositoryName.includes(repositoryName)) {
        const updatedRepositoryNames = [...favorite.repositoryName, repositoryName];
        return favorite.update({ repositoryName: updatedRepositoryNames });
    }

    return "Repository already favorite";
}

/**
 *
 * @param githubId
 * @param repositoryName
 * @returns
 */
const removeFavoriteRepository = async (email: string,repositoryName: string) => {
  
  const favorite = await FavoritesModel.findOne({ where: { email: email } });

  if (!favorite) {
    throw new Error("User not registered");
  }
  if (!favorite.dataValues.repositoryName.includes(repositoryName)) {
    throw new Error("Repository not in favorites");
  }

  const updatedRepositoryNames = favorite.dataValues.repositoryName.filter(
    (name: string) => name !== repositoryName
  );

  return favorite.update({
    repositoryName: updatedRepositoryNames
  });
};

export { addFavoriteRepository, removeFavoriteRepository };
