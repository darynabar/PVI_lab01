<?php
require_once __DIR__ . '/../models/StudentModel.php';

class StudentController
{
    private $model;

    public function __construct()
    {
        $this->model = new StudentModel();
    }

    // Метод для виведення списку
    // Оновлена функція з підтримкою пагінації (заміни свою стару)
    public function getStudents()
    {
        
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = 5; // Скільки студентів на сторінку
        $offset = ($page - 1) * $limit;

        $allStudents = $_SESSION['students'] ?? [];
        $totalStudents = count($allStudents);

        $paginatedStudents = array_slice($allStudents, $offset, $limit);

        echo json_encode([
            'success' => true,
            'data' => $paginatedStudents,
            'totalPages' => ceil($totalStudents / $limit),
            'currentPage' => $page
        ]);
        exit;
    }

    // НОВА ФУНКЦІЯ: Збереження (додавання і редагування)
    public function saveStudent()
    {
        
        $requestData = json_decode(file_get_contents("php://input"), true);

        $id = $requestData['id'] ?? null;
        $name = trim($requestData['name'] ?? '');
        $group = trim($requestData['group'] ?? '');
        $birthday = trim($requestData['birthday'] ?? '');

        $errors = [];

        // а) Валідація
        if (empty($name))
            $errors[] = "Ім'я не може бути порожнім.";
        if (empty($group))
            $errors[] = "Група є обов'язковою.";
        if (empty($birthday))
            $errors[] = "Дата народження обов'язкова.";

        if (!isset($_SESSION['students'])) {
            $_SESSION['students'] = [];
        }

        // б) Перевірка на дублювання
        foreach ($_SESSION['students'] as $student) {
            if ($student['name'] === $name && $student['id'] != $id) {
                $errors[] = "Студент з таким ім'ям вже існує!";
                break;
            }
        }

        // г) Повертаємо помилки
        if (!empty($errors)) {
            echo json_encode(['success' => false, 'message' => implode("<br>", $errors)]);
            exit;
        }

        // в) Збереження
        if ($id) {
            foreach ($_SESSION['students'] as $key => $student) {
                if ($student['id'] == $id) {
                    $_SESSION['students'][$key]['name'] = $name;
                    $_SESSION['students'][$key]['group'] = $group;
                    $_SESSION['students'][$key]['birthday'] = $birthday;
                    break;
                }
            }
        } else {
            $_SESSION['students'][] = [
                'id' => time(), // генеруємо ID
                'name' => $name,
                'group' => $group,
                'birthday' => $birthday,
                'gender' => $requestData['gender'] ?? 'M',
                'status' => 'active'
            ];
        }

        echo json_encode(['success' => true]);
        exit;
    }

    //Видалення
    public function deleteStudent()
    {
        
        $requestData = json_decode(file_get_contents("php://input"), true);
        $idToDelete = $requestData['id'] ?? null;
        $deleted = false;

        if (isset($_SESSION['students'])) {
            foreach ($_SESSION['students'] as $key => $student) {
                if ($student['id'] == $idToDelete) {
                    unset($_SESSION['students'][$key]);
                    $_SESSION['students'] = array_values($_SESSION['students']); // Переіндексовуємо
                    $deleted = true;
                    break;
                }
            }
        }

        if ($deleted) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Помилка: студента не знайдено.']);
        }
        exit;
    }
    // ... ваш попередній код (getStudents) ...

    // Метод для логіну
    public function login()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        // Використовуємо trim(), щоб прибрати випадкові пробіли спереду та ззаду
        $login = isset($data['login']) ? trim($data['login']) : '';
        // $login = isset($data['login']);
        $password = isset($data['password']) ? trim($data['password']) : '';

        $user = $this->model->authenticate($login, $password);

        if ($user) {
            $_SESSION['user'] = $user;
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Невірний логін або пароль']);
        }
    }

    // Метод для виходу (рологінитись)
    public function logout()
    {
        unset($_SESSION['user']);
        echo json_encode(['success' => true]);
    }

    // Метод для перевірки, чи залогінений зараз користувач (знадобиться при оновленні сторінки)
    public function checkAuth()
    {
        if (isset($_SESSION['user'])) {
            echo json_encode(['success' => true, 'user' => $_SESSION['user']]);
        } else {
            echo json_encode(['success' => false]);
        }
    }
}
?>