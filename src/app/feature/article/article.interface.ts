
export interface Article {
    id: string;              // Фронтенд ID
    _id?: string;            // Бекенд ID (MongoDB)
    
    // Зв'язок з компанією
    companyId: string;       // ID компанії, якій належить новина
    category?: string;  // Тип компанії (Студія, Аутсорс тощо) з вашого списку
    
    // Контент
    title: string;
    content: string;
    imageUrl: string;
    
    // Метадані
    author?: string;         // Хто створив новину
    views?: number;          // Кількість переглядів
    createdAt: number;       // Дата створення (timestamp)
    updatedAt?: number;      // Дата останнього оновлення
}