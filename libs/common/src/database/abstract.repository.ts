import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}
  async create(doc: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDoc = new this.model({
      ...doc,
      _id: new Types.ObjectId(),
    });
    return await createdDoc.save();
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    let doc = await this.model.findOne(filterQuery).lean<TDocument>(true);
    if (!doc) {
      this.logger.warn('Document not found', filterQuery);
      throw new NotFoundException('Not found');
    }
    return doc;
  }

  async update(
    filterQuery: FilterQuery<TDocument>,
    data: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    let doc = (await this.model
      .findOneAndUpdate(filterQuery, data, {
        new: true,
      })
      .lean<TDocument>(true)) as TDocument;
    if (!doc) {
      this.logger.warn('Document not found', filterQuery);
      throw new NotFoundException('Not found');
    }
    return doc;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async remove(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    return await this.model.deleteOne(filterQuery).lean<TDocument>(true);
  }
}
