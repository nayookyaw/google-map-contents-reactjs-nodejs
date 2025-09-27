import { UsersRepository } from '../repositories/UsersRepository'; 
import { CreateUserDto } from '../models/userDtos'; 

export class UsersService{ 
  constructor(private repo=new UsersRepository()){} 
  list(){return this.repo.list()} 
  
  create(input:CreateUserDto){return this.repo.create(input)} }
