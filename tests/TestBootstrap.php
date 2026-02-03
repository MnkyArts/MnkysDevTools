<?php declare(strict_types=1);

/**
 * PHPUnit Bootstrap for MnkysDevTools Unit Tests
 * 
 * This bootstrap supports two modes:
 * 1. Unit tests with mocks (no Shopware kernel required) - DEFAULT
 * 2. Integration tests with full Shopware kernel (requires shop setup)
 * 
 * For unit tests, we just need the Composer autoloader.
 * For integration tests, uncomment the Shopware TestBootstrapper section.
 */

// Find the Composer autoloader
$autoloadPaths = [
    // Plugin development standalone
    __DIR__ . '/../vendor/autoload.php',
    // Plugin within Shopware installation
    __DIR__ . '/../../../../vendor/autoload.php',
    // Shopware project root
    __DIR__ . '/../../../vendor/autoload.php',
];

$autoloader = null;
foreach ($autoloadPaths as $path) {
    if (file_exists($path)) {
        $autoloader = require $path;
        break;
    }
}

if ($autoloader === null) {
    throw new RuntimeException(
        'Could not find Composer autoloader. Please run "composer install" in the project root.'
    );
}

// Register the test namespace
$autoloader->addPsr4('MnkysDevTools\\Tests\\', __DIR__);

/*
 * For Integration Tests (requires full Shopware installation):
 * Uncomment the following block to use Shopware's TestBootstrapper
 * 
 * Note: This requires the Shopware test environment to be set up.
 * Run: bin/console system:install --basic-setup --create-database -f
 * 
 * use Shopware\Core\TestBootstrapper;
 * 
 * $loader = (new TestBootstrapper())
 *     ->addCallingPlugin()
 *     ->addActivePlugins('MnkysDevTools')
 *     ->setForceInstallPlugins(true)
 *     ->bootstrap()
 *     ->getClassLoader();
 * 
 * $loader->addPsr4('MnkysDevTools\\Tests\\', __DIR__);
 */
