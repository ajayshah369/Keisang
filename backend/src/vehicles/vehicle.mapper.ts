// users/mappers/user.mapper.ts
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Vehicle } from './vehicles.models';
import { VehicleEntity } from './entities/vehicle.entity';

export class VehicleMapper {
  static toEntity(vehicleDto: CreateVehicleDto): VehicleEntity {
    return {
      title: vehicleDto.title,
      description: vehicleDto.description,
      condition: vehicleDto.condition,
      brand: vehicleDto.brand,
      product_type: vehicleDto.product_type,
      custom_label: vehicleDto.custom_label,
      dealer: vehicleDto.dealer,
      timestamp: vehicleDto.timestamp,
      price: vehicleDto.price,
    };
  }

  static toModel(vehicleEntity: VehicleEntity): Partial<Vehicle> {
    return {
      title: vehicleEntity.title,
      description: vehicleEntity.description,
      condition: vehicleEntity.condition,
      brand: vehicleEntity.brand,
      product_type: vehicleEntity.product_type,
      custom_label: vehicleEntity.custom_label,
      dealer: vehicleEntity.dealer,
      timestamp: vehicleEntity.timestamp,
      price: vehicleEntity.price,
    };
  }

  static modelToEntity(vehicleModel: Vehicle): VehicleEntity {
    return {
      uuid: vehicleModel.uuid,
      title: vehicleModel.title,
      description: vehicleModel.description,
      condition: vehicleModel.condition,
      brand: vehicleModel.brand,
      product_type: vehicleModel.product_type,
      custom_label: vehicleModel.custom_label,
      dealer: vehicleModel.dealer,
      timestamp: vehicleModel.timestamp,
      price: vehicleModel.price,
    };
  }
}
