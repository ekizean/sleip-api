import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentData, Firestore, Query } from '@google-cloud/firestore';
import { HorsesQuery } from './dto/horses.query';
import { CreateHorseDto } from './dto/create-horse.dto';
import { Horse } from './horses.constants';
import { UpdateHorseDto } from './dto/update-horse.dto';

@Injectable()
export class HorsesService {
  private collectionName = 'horses';

  constructor(private firestore: Firestore) {}

  async createHorse(dto: CreateHorseDto): Promise<Horse> {
    const createdAt = new Date().toISOString();
    const docRef = await this.firestore
      .collection(this.collectionName)
      .add({ ...dto, createdAt });

    const snap = await docRef.get();
    return { id: snap.id, ...snap.data() } as Horse;
  }

  async getHorses(query: HorsesQuery): Promise<Horse[]> {
    let ref: Query<DocumentData> = this.firestore.collection(
      this.collectionName,
    );

    if (query.age) {
      ref = ref.where('age', '==', Number(query.age));
    }
    if (query.breed) {
      ref = ref.where('breed', '==', query.breed);
    }
    if (query.healthStatus) {
      ref = ref.where('healthStatus', '==', query.healthStatus);
    }

    const snapshot = await ref.get();
    return snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as Horse;
    });
  }

  async updateHorse(id: string, updateData: UpdateHorseDto): Promise<Horse> {
    const docRef = this.firestore.collection(this.collectionName).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException(`Horse with id ${id} not found`);
    }

    // Filter out undefined values since Firestore does not allow undefined values
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined),
    );

    await docRef.update(filteredData);
    const updatedSnap = await docRef.get();
    return { id: updatedSnap.id, ...updatedSnap.data() } as Horse;
  }

  async deleteHorse(id: string): Promise<void> {
    const docRef = this.firestore.collection(this.collectionName).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException(`Horse with id ${id} not found`);
    }

    await docRef.delete();
  }
}
