<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/controllers/StudentController.php';

$controller = new StudentController();

header("Location : Students.html");

// Простий роутінг: перевіряємо, який метод запитує клієнт
// $action = isset($_GET['action']) ? $_GET['action'] : 'getStudents';
// unset($_SESSION[""]);
$action = isset($_GET['action']) ? $_GET['action'] : 'login';
switch ($action) {
    case 'getStudents':
        $controller->getStudents();
        break;
    case 'login':
        $controller->login();
        break;
    case 'logout':
        $controller->logout();
        break;
    case 'checkAuth':
        $controller->checkAuth();
        break;
    // --- ДОДАЄМО НОВІ МАРШРУТИ ТУТ ---
    case 'saveStudent':
        $controller->saveStudent();
        break;
    case 'deleteStudent':
        $controller->deleteStudent();
        break;
    // ---------------------------------
    default:
        echo json_encode(['success' => false, 'message' => 'Невідома дія']);
        break;
}
?>