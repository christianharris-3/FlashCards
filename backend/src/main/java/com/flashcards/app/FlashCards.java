package com.flashcards.app;

import com.flashcards.app.config.AppConfiguration;
import com.flashcards.app.config.MySqlLogger;
import com.flashcards.app.config.FlashCardAuthenticator;
import com.flashcards.app.dao.AuthDao;
import com.flashcards.app.dao.CollectionDao;
import com.flashcards.app.dao.FlashCardDao;
import com.flashcards.app.dao.LearningDao;
import com.flashcards.app.managers.CollectionManager;
import com.flashcards.app.managers.FlashCardManager;
import com.flashcards.app.managers.LearningManager;
import com.flashcards.app.managers.UserValidationManager;
import com.flashcards.app.models.dao.FlashCard;
import com.flashcards.app.resources.FlashCardResource;
import com.flashcards.app.resources.LearningResource;
import com.flashcards.app.resources.LoginResource;
import com.flashcards.app.resources.CollectionDataResource;
import com.flashcards.app.exceptions.mapper.UnauthorisedExceptionMapper;
import com.flashcards.app.models.User;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;
import io.dropwizard.core.Application;
import io.dropwizard.core.setup.Environment;
import io.dropwizard.db.ManagedDataSource;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.sqlobject.SqlObjectPlugin;

public class FlashCards extends Application<AppConfiguration> {

    public static void main(String[] args) throws Exception {
        new FlashCards().run(args);
    }

    @Override
    public void run(AppConfiguration configuration,
                    Environment environment) {

        final ManagedDataSource dataSource = configuration.getDatabase().build(
                environment.metrics(), "db"
        );

        // DB setup
        final Jdbi jdbi = Jdbi.create(dataSource);
        jdbi.installPlugin(new SqlObjectPlugin());
        jdbi.setSqlLogger(new MySqlLogger());

        CollectionDao collectionDao = jdbi.onDemand(CollectionDao.class);
        AuthDao authDao = jdbi.onDemand(AuthDao.class);
        FlashCardDao flashCardDao = jdbi.onDemand(FlashCardDao.class);
        LearningDao learningDao = jdbi.onDemand(LearningDao.class);

        // Managers
        UserValidationManager userValidationManager = new UserValidationManager(authDao, flashCardDao);
        CollectionManager collectionDataManager = new CollectionManager(collectionDao, flashCardDao, authDao);
        FlashCardManager flashCardManager = new FlashCardManager(flashCardDao);
        LearningManager learningManager = new LearningManager(learningDao);


        // Auth
        FlashCardAuthenticator authenticator = new FlashCardAuthenticator(authDao);

        environment.jersey().register(
                new AuthDynamicFeature(
                        new OAuthCredentialAuthFilter.Builder<User>()
                                .setAuthenticator(authenticator)
                                .setPrefix("Bearer")
                                .setUnauthorizedHandler(new UnauthorisedExceptionMapper())
                                .buildAuthFilter()
                )
        );
        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(User.class));


        // API endpoints
        environment.jersey().register(new LoginResource(authenticator));
        environment.jersey().register(new CollectionDataResource(collectionDataManager, userValidationManager));
        environment.jersey().register(new FlashCardResource(flashCardManager, userValidationManager));
        environment.jersey().register(new LearningResource(learningManager, userValidationManager));
    }
}