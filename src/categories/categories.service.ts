import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { PlayersService } from 'src/players/players.service';
import { AssignPlayerToCategoryDto } from './dtos/assign-player-to-category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interface/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const categoryExist = await this.categoryModel.findOne({ category }).exec();

    if (categoryExist) {
      throw new BadRequestException(`Categoria ${category} já cadastrada`);
    }

    const categoryCreate = new this.categoryModel(createCategoryDto);

    return await categoryCreate.save();
  }

  async getAllCategories(): Promise<Array<Category>> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async getCategory(category: string): Promise<Category> {
    const categoryDoc = await this.categoryModel.findOne({ category }).exec();

    if (!categoryDoc) {
      throw new NotFoundException(`Categoria ${category} não encontrado`);
    }

    return categoryDoc;
  }

  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const categoryExist = await this.categoryModel.findOne({ category }).exec();

    if (!categoryExist) {
      throw new NotFoundException(`Categoria ${category} não encontrado`);
    }

    return await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoryDto })
      .exec();
  }

  async getPlayerCategory(player: Player): Promise<Category> {
    return await this.categoryModel
      .findOne()
      .where('players')
      .in(player._id)
      .exec();
  }

  async assignPlayerToCategory(
    assignPlayerToCategoryDto: AssignPlayerToCategoryDto,
  ): Promise<void> {
    const { player, category } = assignPlayerToCategoryDto;

    const categoryDoc = await this.categoryModel.findOne({ category });
    const playerDoc = await this.playersService.getPlayerById(player);

    if (!categoryDoc) {
      throw new BadRequestException(`Categoria ${category} não encontrado`);
    }

    const playerAlreadyRegistered = categoryDoc.players.find(
      (categoryPlayer) => {
        return String(categoryPlayer._id) === String(playerDoc.id);
      },
    );

    if (playerAlreadyRegistered) {
      throw new BadRequestException(`Jogador já registrado nesta categoria`);
    }

    const oldPlayerCategory = await this.getPlayerCategory(playerDoc);

    if (oldPlayerCategory) {
      oldPlayerCategory.players = oldPlayerCategory.players.filter(
        (categoryPlayer) => {
          return String(categoryPlayer._id) !== String(playerDoc._id);
        },
      );
      await this.updateCategory(oldPlayerCategory.category, oldPlayerCategory);
    }

    categoryDoc.players.push(playerDoc.id);

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: categoryDoc })
      .exec();
  }

  async deleteCategory(category: string): Promise<void> {
    const categoryExist = await this.categoryModel.findOne({ category }).exec();

    if (!categoryExist) {
      throw new NotFoundException(`Categoria ${category} não encontrado`);
    } else if (!!categoryExist.players.length) {
      throw new NotFoundException(
        `Uma categoria que contém jogadores registrados não pode ser excluída`,
      );
    }

    await this.categoryModel.deleteOne({ category }).exec();
  }
}
