import { Injectable, NotFoundException } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Owner } from './owners.constants';

@Injectable()
export class OwnersService {
  private collectionName = 'owners';

  constructor(private firestore: Firestore) {}

  async createOwner(dto: CreateOwnerDto): Promise<Owner> {
    const createdAt = new Date().toISOString();
    const docRef = await this.firestore
      .collection(this.collectionName)
      .add({ ...dto, createdAt });

    const snap = await docRef.get();
    return { id: snap.id, ...snap.data() } as Owner;
  }

  async getOwnerById(id: string): Promise<Owner> {
    const docRef = this.firestore.collection(this.collectionName).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      throw new NotFoundException(`Owner with id ${id} not found`);
    }
    return { id: snap.id, ...snap.data() } as Owner;
  }

  async getOwners(): Promise<Owner[]> {
    const snapshot = await this.firestore.collection(this.collectionName).get();
    return snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as Owner;
    });
  }

  async updateOwner(id: string, updateData: UpdateOwnerDto): Promise<Owner> {
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined),
    );

    const docRef = this.firestore.collection(this.collectionName).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException(`Owner with id ${id} not found`);
    }

    await docRef.update(filteredData);
    const updatedSnap = await docRef.get();
    return { id: updatedSnap.id, ...updatedSnap.data() } as Owner;
  }

  async deleteOwner(id: string): Promise<void> {
    const docRef = this.firestore.collection(this.collectionName).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException(`Owner with id ${id} not found`);
    }

    await docRef.delete();
  }
}
