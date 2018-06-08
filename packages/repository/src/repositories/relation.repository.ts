// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {EntityCrudRepository} from './repository';
import {
  constrainDataObject,
  constrainFilter,
  constrainWhere,
} from './constraint-utils';
import {DataObject, AnyObject, Options} from '../common-types';
import {Entity} from '../model';
import {Filter, Where} from '../query';

/**
 * CRUD operations for a target repository of a HasMany relation
 */
export interface HasManyEntityCrudRepository<T extends Entity, ID> {
  /**
   * Create a target model instance
   * @param targetModelData The target model data
   * @param options Options for the operation
   * @returns A promise which resolves to the newly created target model instance
   */
  create(targetModelData: Partial<T>, options?: Options): Promise<T>;
  /**
   * Find target model instance(s)
   * @param Filter A filter object for where, order, limit, etc.
   * @param options Options for the operation
   * @returns A promise which resolves with the found target instance(s)
   */
  find(filter?: Filter, options?: Options): Promise<T[]>;
  /**
   * 
   * @param entity 
   * @param options 
   */
  update(entity: DataObject<T>, options?: Options): Promise<boolean>;
  /**
   * 
   * @param entity 
   * @param options 
   */
  delete(entity: DataObject<T>, options?: Options): Promise<boolean>;
  /**
   * 
   * @param entity 
   * @param options 
   */
  save(entity: DataObject<T>, options?: Options): Promise<T | null>;
  /**
   * 
   * @param dataObjects 
   */
  createAll(dataObjects: DataObject<T>[]): Promise<T[]>;
  /**
   * 
   * @param where 
   * @param options 
   */
  deleteAll(where?: Where, options?: Options): Promise<number>;
  /**
   * 
   * @param dataObject 
   * @param where 
   * @param options 
   */
  updateAll(
    dataObject: DataObject<T>,
    where?: Where,
    options?: Options,
  ): Promise<number>;
}

export class DefaultHasManyEntityCrudRepository<
  T extends Entity,
  TargetRepository extends EntityCrudRepository<T, typeof Entity.prototype.id>,
  ID
> implements HasManyEntityCrudRepository<T, ID> {
  /**
   * Constructor of DefaultHasManyEntityCrudRepository
   * @param sourceInstance the source model instance
   * @param targetRepository the related target model repository instance
   * @param foreignKeyName the foreign key name to constrain the target repository
   * instance
   */
  constructor(
    public targetRepository: TargetRepository,
    public constraint: AnyObject,
  ) {}

  async create(targetModelData: Partial<T>, options?: Options): Promise<T> {
    return await this.targetRepository.create(
      constrainDataObject(targetModelData, this.constraint) as Partial<T>,
      options,
    );
  }

  async find(filter?: Filter, options?: Options): Promise<T[]> {
    return await this.targetRepository.find(
      constrainFilter(filter, this.constraint),
      options,
    );
  }

  async update(entity: DataObject<T>, options?: Options): Promise<boolean> {
    return await this.targetRepository.update(entity, options);
  }

  async delete(entity: DataObject<T>, options?: Options): Promise<boolean> {
    return await this.targetRepository.delete(entity, options);
  }

  async save(entity: DataObject<T>, options?: Options): Promise<T | null> {
    return await this.targetRepository.save(entity, options);
  }

  async createAll(dataObjects: DataObject<T>[]): Promise<T[]> {
    return await this.targetRepository.createAll(dataObjects);
  }

  async deleteAll(where?: Where, options?: Options): Promise<number> {
    return await this.targetRepository.deleteAll(
      constrainWhere(where, this.constraint),
      options,
    );
  }
  
  async updateAll(
    dataObject: DataObject<T>,
    where?: Where,
    options?: Options,
  ): Promise<number> {
    return await this.targetRepository.updateAll(
      dataObject,
      constrainWhere(where, this.constraint),
      options,
    );
  }
}
