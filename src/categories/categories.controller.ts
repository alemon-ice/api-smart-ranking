import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { AssignPlayerToCategoryDto } from './dtos/assign-player-to-category.dto';
import { ParamsValidationPipe } from '../common/pipes/params-validation.pipe';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.createCategory(
      createCategoryDto,
    );

    return JSON.stringify({
      message: 'Categoria cadastrada com sucesso',
      data: category,
    });
  }

  @Get()
  async getCategories() {
    const categories = await this.categoriesService.getAllCategories();

    return JSON.stringify({
      message: 'Categorias listadas com sucesso',
      data: categories,
    });
  }

  @Get('/:category')
  async getCategory(@Param('category', ParamsValidationPipe) category: string) {
    const categoryDoc = await this.categoriesService.getCategory(category);

    return JSON.stringify({
      message: 'Jogador encontrado com sucesso',
      data: categoryDoc,
    });
  }

  @Put('/:category')
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('category', ParamsValidationPipe) category: string,
  ) {
    const categoryResponse = await this.categoriesService.updateCategory(
      category,
      updateCategoryDto,
    );

    return JSON.stringify({
      message: 'Categoria atualizada com sucesso',
      data: categoryResponse,
    });
  }

  @Post('/assign-player')
  async assignPlayerToCategory(
    @Body() assignPlayerDto: AssignPlayerToCategoryDto,
  ) {
    await this.categoriesService.assignPlayerToCategory(assignPlayerDto);

    return JSON.stringify({
      message: 'Jogador adicionado à categoria com sucesso',
    });
  }

  @Delete('/:category')
  async deleteCategory(
    @Param('category', ParamsValidationPipe) category: string,
  ) {
    await this.categoriesService.deleteCategory(category);

    return JSON.stringify({
      message: 'Categoria deletada com sucesso',
    });
  }
}
