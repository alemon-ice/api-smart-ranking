import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';

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
  async getCategory(@Param('category') category: string) {
    const categoryDoc = await this.categoriesService.getCategory(category);

    return JSON.stringify({
      message: 'Jogador encontrado com sucesso',
      data: categoryDoc,
    });
  }
}
