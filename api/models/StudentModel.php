<?php
class StudentModel
{
    public function __construct()
    {
        // session_start();
        // Якщо масиву ще немає, створюємо його тут
        if (!isset($_SESSION['students'])) {
            $_SESSION['students'] = [
                ['id' => 1, 'group' => 'PZ-21', 'name' => 'John Smith', 'gender' => 'M', 'birthday' => '2004-06-11', 'status' => 'inactive'],
                ['id' => 2, 'group' => 'PZ-22', 'name' => 'Anna Doe', 'gender' => 'F', 'birthday' => '2004-08-15', 'status' => 'active'],
                ['id' => 3, 'group' => 'PZ-21', 'name' => 'Ivan Franko', 'gender' => 'M', 'birthday' => '1856-08-27', 'status' => 'active'],
                ['id' => 4, 'group' => 'PZ-21', 'name' => 'Daryna Baranova', 'gender' => 'F', 'birthday' => '28.11.2006', 'status' => 'active'],
                ['name' => 'Daryna', 'birthday' => '28.11.2006']


            ];
        }
    }

    // Метод для отримання всіх студентів
    public function getAllStudents()
    {
        return $_SESSION['students'];
    }
  
    public function authenticate($login, $password)
    {
        foreach ($_SESSION['students'] as $student) {
            
            // Перевіряємо, чи збігається ім'я (логін) та день народження (пароль)
            // strcasecmp робить порівняння незалежним від регістру літер
            if ($student['name'] === $login && $student['birthday'] === $password) {
                return $student; // Знайшли студента - повертаємо його дані
            }
        }
        return false; // Такого студента немає
    }

}
?>